var configUtils = require('../config/configUtils');
var sessionUtils = require('../sessions/sessionUtils');
var path = require('path');

function generateDevUser() {
    return JSON.stringify({
        'type': 'development',
        'userid': 12345678,
        'name': 'Developer',
        'email': 'moyerock@gmail.com',
        'avatar': 'https://lh3.googleusercontent.com/-AxuH90mY9tY/AAAAAAAAAAI/AAAAAAAAAAA/8kSyughgw6o/s96-c/photo.jpg'
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
function getUserRootPath(sessionId, callback) {
    getUser(sessionUtils, sessionId, function (err, reply) {
        var uploadPath = '/tmp/';
        if (err)
            console.log(err);
        if (reply) {
            var user = JSON.parse(reply);
            uploadPath = path.join(configUtils.getUploadRoot(), user.type, user.userid.toString());
        }
        callback(err, uploadPath);
    });
};
module.exports.getUserRootPath = getUserRootPath;
