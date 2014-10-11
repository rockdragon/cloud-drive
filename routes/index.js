var express = require('express');
var router = express.Router();

var session = require('../modules/sessions/sessionUtils');
var authUtils = require('../modules/auth/authUtils');

/* GET home page. */
router.route('/').get(function (req, res) {
    var user = null;
    authUtils.getUser(session, function (err, reply) {
        if (err)
            console.log(err);
        if (reply) {
            user = reply;
        }
        res.render('index', {title: 'Welcome to cloud-drive.', user: user});
    });
//    session.get(req, 'user', function (err, reply) {
//        if (err)
//            console.log(err);
//        if (reply) {
//            user = JSON.parse(reply);
//        }
//        res.render('index', {title: 'Welcome to cloud-drive.', user: user});
//    });
});

module.exports = router;
