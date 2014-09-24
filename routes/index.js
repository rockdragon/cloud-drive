var express = require('express');
var router = express.Router();

var session = require('../modules/sessions/sessionUtils');

/* GET home page. */
router.get('/', function (req, res) {
    session.get(req, 'logged', function(err, reply){
        if(err)
            console.log(err);
        if(!reply)
            session.set(req, 'logged', true);
        else
            console.log(reply);
    });

    res.render('index', { title: 'Express' });
});

module.exports = router;
