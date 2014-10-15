(function () {
    $('#upload_button').click(function () {
        $('#uploader').modal();
    });

    //HTML File detection
    window.addEventListener('load', ready);

    function ready() {
        if (window.File && window.FileReader) {
            $('#choose-button').click(function () {
                $('#choose-file').click();
            });

            $('#choose-file').on('change', function () {
                $('#fileName').html($(this).val());
            });

            socketTransaction();
        } else {
            $("#fileName").html('Your browser does not support the File API. please change a newer browser.');
        }
    }

    function socketTransaction() {
        var socket = io.connect('127.0.0.1:3000');
        socket.send('client message');
        socket.on('message', function(time){
            console.log('received server timestamp:' + time);
        });
    }
})();