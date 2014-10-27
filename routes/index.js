var express = require('express');
var router = express.Router();

var session = require('../modules/sessions/sessionUtils');
var userUtils = require('../modules/auth/userUtils');
var storageUtils = require('../modules/db/storageUtils');

/* GET home page. */
router.route('/').get(function (req, res) {
    var user = null;
    userUtils.getUser(session, req, function (err, reply) {
        if (err)
            console.log(err);
        if (reply) {
            user = JSON.parse(reply);
        }
        if(user) {
            storageUtils.getStorageRecordByUser(user, function(err, record){
                if(record)
                    res.render('users/user_index', {title: 'Welcome.', user: user, storage: record.storage});
                else{
                    console.log('create user storage record.');
                    var storage = {
                        name: 'root',
                        path: userUtils.getUserRootPathByUser(user),
                        route: '/',
                        files: [],
                        folders: []
                    };
                    console.log(JSON.stringify(storage));
                    storageUtils.saveStorageByUser(user, storage, function(err){
                        res.render('users/user_index', {title: 'Welcome.', user: user, storage: storage});
                    })
                }
            });
        }
        else
            res.redirect('/login');
    });
});

module.exports = router;
