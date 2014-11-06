var shareUtils = require('../modules/storage/shareUtils');
var fs = require('fs');
var basename = require('path').basename;
var mime = require('mime');

var express = require('express');
var router = express.Router();

/* GET share page. */
router.route('/:link').get(function (req, res) {
    var link = req.params.link;
    if (link) {
        var descriptor = shareUtils.fromDownloadLinkSync(link);
        console.log('descriptor', descriptor);
        if (descriptor) {//{userType, userId, filePath}
            fs.exists(descriptor.filePath, function (exists) {
                if (exists) {
                    res.set('Content-Type', mime.lookup(descriptor.filePath));
                    var filename = basename(descriptor.filePath);
                    var filenameRepr =
                        /[^\040-\176]/.test(filename)
                        ? 'filename="' + encodeURI(filename) + '"; filename*=UTF-8\'\'' + encodeURI(filename)
                        : 'filename="' + filename + '"';
                    res.set('Content-Disposition', filenameRepr);

                    var readStream = fs.createReadStream(descriptor.filePath);
                    readStream.on('open', function(){
                        readStream.pipe(res);
                    });
                    readStream.on('error', function(err) {
                        res.end(err);
                    });
                } else
                    res.redirect('/404');
            });
        } else
            res.redirect('/404');
    } else
        res.redirect('/404');
});

module.exports = router;