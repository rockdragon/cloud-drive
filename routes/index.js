var express = require('express');
var router = express.Router();

var session = require('../modules/sessions/sessionUtils');

/* GET home page. */
router.route('/').get(function (req, res) {
    var user = null;
    session.get(req, 'user', function (err, reply) {
        if (err)
            console.log(err);
        if (reply) {
            user = JSON.parse(reply);
        }
        res.render('index', {title: 'Welcome to cloud-drive.', user: user});
    });
});

module.exports = router;
