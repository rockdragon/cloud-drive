(function () {
    var storageApp = angular.module('storageApp', []);

    storageApp.factory('DataService', [function () {
        return {
            data: JSON.parse($('#storageData').val()),
            rootUrl: $('#rootUrl').val()
        };
    }]);

    storageApp.controller('storageController', ['$scope', '$window', '$log', 'DataService',
        function ($scope, $window, $log, DataService) {
            $scope.binding = function (currentFolder) {
                $scope.model.currentFolder = currentFolder;
                $scope.folders = $scope.model.currentFolder.folders;
                $scope.files = $scope.model.currentFolder.files;
            };
            $scope.isArray = function (obj) {
                return toString.call(obj) === '[object Array]';
            };
            $scope.countBy = function (str, char) {
                var reg = new RegExp(char, "g");
                var result = str.match(reg);
                return result ? result.length : 0;
            };
            $scope.findFolder = function (folders, route) {
                $log.log('find:', folders, route);
                if (!$scope.isArray(folders) && folders.route === route)
                    return folders;
                else {
                    folders = folders.folders;
                    if (folders && folders.length > 0) {
                        for (var j = 0, len2 = folders.length; j < len2; j++) {
                            if (folders[j].route === route) {
                                return folders[j];
                            }
                            var result = $scope.findFolder(folders[j].folders, route);
                            if (result)
                                return result;
                        }
                    }
                }
                return null;
            };

            $scope.writeLinkPaths = function () {
                var paths = [DataService.rootUrl];
                var route = $scope.model.currentFolder.route;
                if (route.length > 1) {
                    route = route.replace(DataService.rootUrl, '');
                    if(route)
                        paths = paths.concat(route.slice(1).split('/'));
                }
                var accumulated = '';
                $scope.linkPaths = [];
                for (var i = 0, len = paths.length; i < len; i++) {
                    accumulated += (i > 0 ? '/' : '') + paths[i];
                    $scope.linkPaths.push({ i: accumulated, t: paths[i] });
                }
            };

            $scope.bindingWithPath = function (currentPath) {
                $log.log('bindingWithPath:',currentPath);
                if ($scope.model.currentFolder.route !== currentPath) {
                    $scope.model.currentFolder = $scope.findFolder($scope.model, currentPath);
                    $log.log('found: ', $scope.model.currentFolder);
                }
                $scope.binding($scope.model.currentFolder);

                $scope.writeLinkPaths();

            };

            $scope.model = DataService.data;
            $scope.binding($scope.model);

            $scope.navigate = function (index) {
                $scope.binding($scope.folders[index]);
                $scope.writeLinkPaths();
            };
            //view file
            $scope.view = function(index){
                var file = $scope.files[index];
                $scope.currentFile = file;
                $('#viewName').val(file.path).click();
            };

            var modelChanged = function (oldValue, newValue, scope) {
                $scope.binding($scope.model.currentFolder);
            };
            $scope.$watch($scope.model, modelChanged, true);

            // provide functionality that change model external
            $scope.addFolder = function (folder) {
                $scope.model.currentFolder.folders.push(folder);
                $scope.$apply();
            };
            $scope.addFile = function (file) {
                $scope.model.currentFolder.files.push(file);
                $scope.$apply();
            };

            // url changed
            $scope.urlChange = function () {
                var route = $window.location.hash.slice(1) || DataService.rootUrl;
                $log.log('urlChange: ', route);
                $scope.bindingWithPath(route);
            };
            $scope.urlChange();
        }]);

    //HTML File detection
    window.addEventListener('load', ready);

    var contextMenuHandle = function (key, options, type) {
        console.log(key, options);
        var target = options.$trigger[0];
        if (key === 'download') {
            var path = $(document.getElementById(target.id)).attr('path');
            $('#downloadName').val(path).click();
        }
    };

    // generate socket connection
    var socketClient = function () {
        var socket = io.connect();
        socket.send('client message');
        socket.on('message', function (time) {
            console.log('received server timestamp:' + time);
        });
        return socket;
    };
    var showView = function(){
        $('#view').modal();
    };

    function ready() {
        $('#storageTable').show();

        // context menu
        $.contextMenu({
            selector: '.lineFile',
            callback: function (key, options) {
                contextMenuHandle(key, options, 'file');
            },
            items: {
                "sep1": "---------",
                "download": {name: "Download", icon: "paste"},
                "sep1": "---------"
            }
        });

        var socket = socketClient();
        socket.on('connect', function () {
            console.log('connection established.');
        });
        //received download link
        socket.on('downlink', function (data) {
            window.location = '/file/' + data.link;
        });
        //received view link
        socket.on('viewLink', function(data){
            $('#viewFrame').attr('src', '/view/' + data.link);
            showView();
        });

        // request link message
        var emitRequestLink = function(path, msgName){
            socket.emit(msgName, {
                'SessionId': $.cookie('session_id'),
                'FilePath': path
            });
        };
        // download File message
        $('#downloadName').click(function () {
            emitRequestLink($(this).val(), 'download');
        });
        // view File message
        $('#viewName').click(function(){
            emitRequestLink($(this).val(), 'view');
        });
    }

})();