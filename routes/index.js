var express = require('express');
var router = express.Router();

var session = require('../modules/sessions/sessionUtils');
var userUtils = require('../modules/auth/userUtils');

/* GET home page. */
router.route('/').get(function (req, res) {
    var user = null;
    userUtils.getUser(session, req, function (err, reply) {
        if (err)
            console.log(err);
        if (reply) {
            user = JSON.parse(reply);
        }
        if(user)
            res.render('users/user_index', {title: 'Welcome to cloud-drive.', user: user});
        else
            res.render('index', {title: 'Welcome to cloud-drive.', user: user});
    });
});

module.exports = router;
