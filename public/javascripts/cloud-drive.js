(function () {
    $('#upload_button').click(function () {
        $('#uploader').modal();
    });

    // generate socket connection
    function socketClient() {
        var socket = io.connect('127.0.0.1:3000');
        socket.send('client message');
        socket.on('message', function (time) {
            console.log('received server timestamp:' + time);
        });
        return socket;
    }

    //HTML File detection
    window.addEventListener('load', ready);

    function ready() {
        if (window.File && window.FileReader) {
            var socket = socketClient();

            $('#choose-button').click(function () {
                $('#choose-file').click();
            });

            $('#choose-file').on('change', function () {
                var file = $(this)[0].files[0];
                if (file) {
                    $('#fileName').val(file.name);
                    var fileReader = new FileReader();
                    fileReader.onload = function (evnt) {
                        socket.emit('upload', { 'Name': file.name, 'Segment': evnt.target.result, 'SessionId': $.cookie('session_id')});
                    };
                    socket.emit('start', {'Name': file.name, 'Size': file.size, 'SessionId': $.cookie('session_id')});

                    socket.on('moreData', function (data) { // more data in progress
                        updateProgressBar(data.percent);
                        var position = data.position * 524288;
                        var sliceFunc = file.webkitSlice ? file.webkitSlice : file.mozSlice;
                        var newFile = sliceFunc(position, position + Math.min(524288, file.size - position));
                        fileReader.readAsBinaryString(newFile);
                    });

                    socket.on('done', function(data){
                        $('#fileName').val('');
                        updateProgressBar(0);
                    });
                }
            });
        } else {
            $("#fileName").html('Your browser does not support the File API. please change a newer browser.');
        }
    }

    function updateProgressBar(percent){
        $('#ProgressBar').val(percent);
    }
})();