(function() {
    $('#upload_button').click(function(){
        $('#uploader').modal();
    });

    $('#choose-button').click(function(){
        $('#choose-file').click();
    });

    $('#choose-file').on('change',function(){
        $('#fileName').html($(this).val());
    });
})();