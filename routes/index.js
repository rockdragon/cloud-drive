var express = require('express');
var router = express.Router();

var session = require('../modules/sessions/sessionUtils');

/* GET home page. */
router.get('/', function (req, res) {
    session.get(req, 'user', function(err, reply){
        if(err)
            console.log(err);
        if(reply){
            var user = JSON.parse(reply);
            res.render('index', { title: 'Welcome to cloud-drive.', user: user });
        } else {
            res.render('index', { title: 'Welcome to cloud-drive.', user: null });
        }
    });
});

module.exports = router;
