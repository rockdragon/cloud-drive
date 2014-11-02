var configUtils = require('../config/configUtils');
var sessionUtils = require('../sessions/sessionUtils');
var path = require('path');

function generateDevUser() {
    return JSON.stringify({
        'type': 'development',
        'userid': 12345678,
        'name': 'Developer',
        'email': 'moyerock@gmail.com',
        'avatar': 'http://d13pix9kaak6wt.cloudfront.net/background/users/y/e/dot/ye.mo_1395547155_9.jpg'
    });
}
/*
 get user by userid
 */
function getUserById(session, id, callback) {
    if (configUtils.isDevelopment()) {
        return callback(null, generateDevUser());
    } else {
        return session.getById(id, 'user', function (err, reply) {
            return callback(err, reply);
        });
    }
};
module.exports.getUserById = getUserById;
/*
 get current user
 */
function getUser(session, req, callback) {
    if (configUtils.isDevelopment()) {
        return callback(null, generateDevUser());
    } else {
        session.get(req, 'user', function (err, reply) {
            return callback(err, reply);
        });
    }
};
module.exports.getUser = getUser;

/*
 get user upload path
 */
function getUserRootPathByUser(user) {
    return path.join(configUtils.getUploadRoot(), user.type, user.userid.toString());
};
module.exports.getUserRootPathByUser = getUserRootPathByUser;

function getUserRootPath(sessionId, callback) {
    getUserById(sessionUtils, sessionId, function (err, reply) {
        if (err)
            console.log(err);
        var uploadPath = '/tmp/';
        var user = JSON.parse(reply);
        if(user)
            uploadPath = getUserRootPathByUser(user);
        console.log(uploadPath);
        callback(err, uploadPath);
    });
};
module.exports.getUserRootPath = getUserRootPath;


