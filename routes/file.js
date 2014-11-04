var shareUtils = require('../modules/storage/shareUtils');
var fs = require('fs');

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
                    res.attachment(descriptor.filePath);

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