var express = require('express');
var router = express.Router();

var session = require('../modules/sessions/sessionUtils');
var userUtils = require('../modules/auth/userUtils');

//mock up
var storage = {
    files: [
        {
            name: '1.zip',
            path: '/users/moye/1.zip',
            size: '1.1M',
            suffix: 'zip',
            mime: 'zip',
            modified: '2011/04/25 11:20AM'
        },
        {
            name: '2.zip',
            path: '/users/moye/2.zip',
            size: '2.1M',
            suffix: 'zip',
            mime: 'zip',
            modified: '2011/04/25 10:00PM'
        }
    ],
    folders: [
        {
            name: 'home',
            path: '/users/moye/home',
            route: 'home',
            folders:[
                {
                    name: 'second',
                    path: '/users/moye/home/second',
                    route: 'home/second',
                    folders: [],
                    files: []
                }
            ],
            files: []
        }
    ]
};

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
            res.render('users/user_index', {title: 'Cloud-drive.', user: user, storage: storage});
        else
            res.render('index', {title: 'Cloud-drive.', user: user, storage: storage});
    });
});

module.exports = router;
