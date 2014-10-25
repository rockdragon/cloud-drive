(function () {
    var storageApp = angular.module('storageApp', []);

    storageApp.controller('storageController', ['$scope', function ($scope) {
        $scope.binding = function (currentFolder) {
            $scope.model.currentFolder = currentFolder;
            $scope.folders = $scope.model.currentFolder.folders;
            $scope.files = $scope.model.currentFolder.files;
        };
        $scope.findFolder = function (folders, route) {
            if (folders && folders.length > 0) {
                for (var j = 0, len2 = folders.length; j < len2; j++) {
                    if (folders[j].route === route) {
                        return folders[j];
                    }
                    var result = findParent(folders[j].folders, route);
                    if (result)
                        return result;
                }
            }
            return null;
        };
        $scope.bindingWithPath = function (currentPath) {
            if ($scope.currentFolder.route !== currentPath) {
                $scope.currentFolder = $scope.findFolder($scope.model.folders, currentPath);
            }
            $scope.binding($scope.currentFolder);
        };

        $scope.model = JSON.parse($('#storageData').val());
        $scope.binding($scope.model);

        $scope.navigate = function (index) {
            $scope.binding($scope.folders[index]);
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
    }]);

    // provide Angular scope for external caller.
    var getAngularScope = function () {
        var appElement = document.querySelector('[ng-controller="storageController"]');
        return angular.element(appElement).scope();
    };

    $('#upload_button').click(function () {
        $('#uploader').modal();
    });

    $('#new_folder_button').click(function () {
        var $scope = getAngularScope();
        $scope.addFolder({
            name: 'demo',
            path: '/users/moye/demo',
            route: 'demo',
            folders: [],
            files: []
        });
    });

    // generate socket connection
    var socketClient = function () {
        var socket = io.connect('127.0.0.1:3000');
        socket.send('client message');
        socket.on('message', function (time) {
            console.log('received server timestamp:' + time);
        });
        return socket;
    };

    // get current path from url
    var currentPath = function () {
        return $('#currentPath').val();
    };

    //HTML File detection
    window.addEventListener('load', ready);

    function ready() {
        $('#storageTable').show();

        if (window.File && window.FileReader) {
            var socket = socketClient();

            $('#choose-button').click(function () {
                $('#choose-file').click();
            });

            $('#choose-file').on('change', function () {
                var file = document.getElementById('choose-file').files[0];
                if (file) {
                    $('#fileName').val(file.name);
                    var fileReader = new FileReader();
                    fileReader.onload = function (evnt) {
                        socket.emit('upload', { 'Name': file.name, 'Segment': evnt.target.result, 'SessionId': $.cookie('session_id')});
                    };
                    socket.emit('start', {'Name': file.name,
                        'Size': file.size,
                        'SessionId': $.cookie('session_id'),
                        'CurrentPath': currentPath()
                    });

                    socket.on('moreData', function (data) { // more data in progress
                        console.log('moreData: ' + JSON.stringify(data));
                        updateProgressBar(data.percent);
                        var position = data.position * 524288;
                        var newFile = null;
                        if (file.slice)
                            newFile = file.slice(position, position + Math.min(524288, file.size - position));
                        else if (file.webkitSlice)
                            newFile = file.webkitSlice(position, position + Math.min(524288, file.size - position));
                        else if (file.mozSlice)
                            newFile = file.mozSlice(position, position + Math.min(524288, file.size - position));
                        if (newFile)
                            fileReader.readAsBinaryString(newFile); // trigger upload event
                    });

                    socket.on('done', function (data) {
                        console.log('[done]: ' + JSON.stringify(data));
                        $('#fileName').val('');
                        delete fileReader;
                        updateProgressBar(100);
                    });
                }
            });
        } else {
            $("#fileName").html('Your browser does not support the File API. please change a newer browser.');
        }
    }

    function updateProgressBar(percent) {
        $('#progressBar').val(percent);
    }
})();