var shareUtils = require('../modules/storage/shareUtils');

var express = require('express');
var router = express.Router();

/* GET share page. */
router.route('/:link').get(function (req, res) {
    var link = req.params.link;
    if (link) {
        var descriptor = shareUtils.fromSharedLinkSync(link);
        if (descriptor) {//{userType, userId, storageType, route}
            shareUtils.getSpecificStorage(
                descriptor.userType, descriptor.userId, descriptor.resourceType, descriptor.route,
                function (err, resource) {
                    if (resource) {//folder or file
                        var title = 'Shared ' + descriptor.resourceType + ': ' + resource.name;
                        if (descriptor.storageType === 'file')
                            resource = {
                                files: [resource],
                                folders: [],
                                route: "/",
                                path: "/Share",
                                name: "share"
                            };
                        console.log('resource:', resource);
                        return res.render('share/share', {title: title, storage: resource,
                            rootUrl: resource.route});
                    } else
                        res.redirect('/404');
                }
            );
        } else
            res.redirect('/404');
    } else
        res.redirect('/404');
});

module.exports = router;