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
        var appElement = document.querySelector('[ng-controller=storageController]');
        return angular.element(appElement).scope();
    };

    // show error then fade out
    var showErrorMessage = function(msg){
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

    //HTML File detection
    window.addEventListener('load', ready);

    function ready() {
        $('#storageTable').show();

        if (window.File && window.FileReader) {
            var socket = socketClient();
            socket.on('connect', function () {
                console.log('connection established.');
            });
            socket.on('error', function(){
                socket = socketClient();
            });
            //for add folder
            socket.on('errorOccurs', function(data){
                showErrorMessage(data.error);
            });
            socket.on('createFolderDone', function(data){
                console.log('createFolderDone received. ' + JSON.stringify(data));
                getAngularScope().addFolder({
                    name: data.folder.name,
                    path: data.folder.path,
                    route: data.folder.route,
                    folders: [],
                    files: []
                });
            });

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
                        'CurrentPath': getAngularScope().model.currentFolder.route
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

            $('#upload_button').click(function () {
                $('#uploader').modal();
            });

            $('#new_folder_button').click(function () {
                $('#folderNameLine').show();
                $('#folderName').focus();
            });

            // Folder creation
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
        } else {
            $('#fileName').html('Your browser does not support the File API. please change a newer browser.');
        }
    }

    function updateProgressBar(percent) {
        $('#progressBar').val(percent);
    }
})();