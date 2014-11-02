(function () {
    var storageApp = angular.module('storageApp', []);

    storageApp.factory('DataService', [function () {
        return {
            data: JSON.parse($('#storageData').val())
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
            $scope.findFolder = function (folders, route) {
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
                var paths = ['/'];
                var route = $scope.model.currentFolder.route;
                if (route.length > 1)
                    paths = paths.concat(route.slice(1).split('/'));
                var accumulated = '';
                $scope.linkPaths = [];
                for (var i = 0, len = paths.length; i < len; i++) {
                    accumulated += (i > 1 ? '/' : '') + paths[i];
                    $scope.linkPaths.push({ i: accumulated, t: paths[i] });
                }
            };

            $scope.bindingWithPath = function (currentPath) {
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
                var route = $window.location.hash.slice(1) || '/';
                $scope.bindingWithPath(route);
            };
            $scope.urlChange();
        }]);

    // provide Angular scope for external caller.
    var getAngularScope = function () {
        var appElement = document.querySelector('[ng-controller=storageController]');
        return angular.element(appElement).scope();
    };

    // show error then fade out
    var showErrorMessage = function (msg) {
        $('#folderNameLabel').text(msg).show().fadeOut(3000);
    };

    // generate socket connection
    var socketClient = function () {
        var socket = io.connect('127.0.0.1:3000');
        socket.send('client message');
        socket.on('message', function (time) {
            console.log('received server timestamp:' + time);
        });
        return socket;
    };

    var showDialog = function () {
        $('#uploader').modal();
    };
    var hideDialog = function () {
        $('#uploader').modal('hide');
    };
    var showConfirm = function (name) {
        $('#confirmName').text(name);
        $('#deleteName').val(name);
        $('#confirm').modal();
    };
    var hideConfirm= function () {
        $('#confirm').modal('hide');
    };
    var contextMenuHandle = function(key, options, type){
        var resourceName = options.$trigger[0].id.split('_')[1];
        if(key === 'delete'){
            $('#deleteType').val(type);
            showConfirm(resourceName);
        }
    };

    //HTML File detection
    window.addEventListener('load', ready);

    function ready() {
        $('#storageTable').show();

        // context menu
        $.contextMenu({ // folder Context Menu
            selector: '.lineFolder',
            callback: function (key, options) {
                contextMenuHandle(key, options, 'folder');
            },
            items: {
                "share": {name: "Share Link", icon: "copy"},
                "rename": {name: "Rename", icon: "edit"},
                "sep1": "---------",
                "delete": {name: "Delete", icon: "delete"}
            }
        });
        $.contextMenu({ // file Context Menu
            selector: '.lineFile',
            callback: function (key, options) {
                contextMenuHandle(key, options, 'file');
            },
            items: {
                "share": {name: "Share Link", icon: "copy"},
                "download": {name: "Download", icon: "paste"},
                "rename": {name: "Rename", icon: "edit"},
                "sep1": "---------",
                "delete": {name: "Delete", icon: "delete"}
            }
        });

        if (window.File && window.FileReader) {
            var socket = socketClient();
            socket.on('connect', function () {
                console.log('connection established.');
            });
            socket.on('error', function () {
                socket = socketClient();
            });
            //for add folder
            socket.on('errorOccurs', function (data) {
                showErrorMessage(data.error);
            });
            socket.on('createFolderDone', function (data) {
                console.log('createFolderDone received. ' + JSON.stringify(data));
                getAngularScope().addFolder({
                    name: data.folder.name,
                    path: data.folder.path,
                    route: data.folder.route,
                    folders: [],
                    files: []
                });
            });

            //for add file
            var currentFile = null;
            var currentFileReader = null;
            socket.on('moreData', function (data) { // more data in progress
                console.log('moreData: ' + JSON.stringify(data));
                updateProgressBar(data.percent);
                var position = data.position * 524288;
                var newFile = null;
                if (currentFile.slice)
                    newFile = currentFile.slice(position, position + Math.min(524288, currentFile.size - position));
                else if (currentFile.webkitSlice)
                    newFile = currentFile.webkitSlice(position, position + Math.min(524288, currentFile.size - position));
                else if (currentFile.mozSlice)
                    newFile = currentFile.mozSlice(position, position + Math.min(524288, currentFile.size - position));
                if (newFile)
                    currentFileReader.readAsBinaryString(newFile); // trigger upload event
            });
            socket.on('done', function (data) {
                console.log('[done]: ' + JSON.stringify(data.file));
                $('#fileName').val('');
                delete currentFileReader;
                delete currentFile;
                updateProgressBar(100);
                getAngularScope().addFile(data.file);
                hideDialog();
            });

            $('#choose-button').click(function () {
                $('#choose-file').click();
            });

            $('#choose-file').on('change', function () {
                currentFile = document.getElementById('choose-file').files[0];
                if (currentFile) {
                    $('#fileName').val(currentFile.name);
                    currentFileReader = new FileReader();
                    currentFileReader.onload = function (evnt) {
                        socket.emit('upload', { 'Name': currentFile.name,
                            'Segment': evnt.target.result, 'SessionId': $.cookie('session_id')});
                    };
                    socket.emit('start', {'Name': currentFile.name,
                        'Size': currentFile.size,
                        'SessionId': $.cookie('session_id'),
                        'CurrentPath': getAngularScope().model.currentFolder.route
                    });
                }
            });

            $('#upload_button').click(function () {
                showDialog();
            });

            // Folder creation
            $('#new_folder_button').click(function () {
                $('#folderNameLine').show();
                $('#folderName').focus();
            });

            var folderNameHandle = function (folderName) {
                if (!folderName) {
                    showErrorMessage('请为新文件夹命名');
                } else {
                    var folder = {
                        'SessionId': $.cookie('session_id'),
                        'name': folderName,
                        'parent': getAngularScope().model.currentFolder.route
                    };
                    console.log(folder);
                    socket.emit('createFolder', folder);
                }
                $('#folderNameLine').hide();
                $('#folderName').val('');
            };
            $('#folderName').blur(function () {
                folderNameHandle($(this).val());
            });
            $('#folderName').keydown(function (e) {
                if (e.keyCode == 13) {
                    $(this).blur();
                }
            });

            // Resource deletion
            $('#sureDelete').click(function(){
                var currentPath = getAngularScope().model.currentFolder.route;
                var name = $('#deleteName').val();
                var resourceType = $('#deleteType').val();

                socket.emit('delete', { 'Name': name,
                    'CurrentPath': currentPath,
                    'ResourceType': resourceType,
                    'SessionId': $.cookie('session_id')});
            });
        } else {
            $('#fileName').html('Your browser does not support the File API. please change a newer browser.');
        }
    }

    function updateProgressBar(percent) {
        $('#progressBar').val(percent);
    }
})();