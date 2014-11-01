var shareUtils = require('../modules/storage/shareUtils');

var express = require('express');
var router = express.Router();

/* GET share page. */
router.route('/').get(function (req, res) {
    res.statusCode = 404;
    res.render('404', {title: '404 Not Found.'});
});

module.exports = router;