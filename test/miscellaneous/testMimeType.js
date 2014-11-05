(function () {
    var mime = require('mime');

    //archives
    console.log(mime.lookup('temp.tar.gz'));
    console.log(mime.lookup('temp.rar'));
    console.log(mime.lookup('temp.zip'));
    console.log(mime.lookup('temp.7z'));

    //movie/audio
    console.log(mime.lookup('temp.mp3'));
    console.log(mime.lookup('temp.mp4'));
    console.log(mime.lookup('temp.mkv'));
    console.log(mime.lookup('temp.rmvb'));
    console.log(mime.lookup('temp.avi'));
    console.log(mime.lookup('temp.m4a'));
    console.log(mime.lookup('temp.wmv'));

    //text
    console.log(mime.lookup('temp.txt'));
    console.log(mime.lookup('temp.pdf'));
    console.log(mime.lookup('temp.doc'));
    console.log(mime.lookup('temp.docx'));
    console.log(mime.lookup('temp.ppt'));
    console.log(mime.lookup('temp.xls'));
    console.log(mime.lookup('temp.xlsx'));

    //code
    console.log(mime.lookup('temp.html'));
    console.log(mime.lookup('temp.js'));
    console.log(mime.lookup('temp.cs'));
    console.log(mime.lookup('temp.css'));
    console.log(mime.lookup('temp.java'));
    console.log(mime.lookup('temp.py'));

    //images
    console.log(mime.lookup('temp.jpeg'));
    console.log(mime.lookup('temp.tiff'));
    console.log(mime.lookup('temp.png'));
    console.log(mime.lookup('temp.gif'));
    console.log(mime.lookup('temp.bmp'));
    console.log(mime.lookup('temp.svg'));

    var mimeUtils = require('../../modules/mime/mimeUtils');
    console.log(mimeUtils.lookup('1.zip'));
})();