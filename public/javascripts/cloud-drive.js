(function () {
    angular.module('storageApp', []).
        controller('storageController', ['$scope', function ($scope) {
            $scope.binding = function(current){
                $scope.folders = current.folders;
                $scope.files = current.files;
            };
            $scope.storageModel = JSON.parse($('#storageData').val());
            $scope.binding($scope.storageModel);

            $scope.navigate = function (index) {
                $scope.binding($scope.folders[index]);
            }
        }]);

    $('#upload_button').click(function () {
        $('#uploader').modal();
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