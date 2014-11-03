var express = require('express');
var router = express.Router();

var session = require('../modules/sessions/sessionUtils');
var userUtils = require('../modules/auth/userUtils');

/* GET home page. */
router.route('/').get(function (req, res) {
    userUtils.logOutUser(session, req, function(err){
        res.redirect('/login');
    });
});

module.exports = router;