var config = require('../config/configUtils');

function generateDevUser() {
    return {
        'type': 'development',
        'userid': 12345678,
        'name': 'Developer',
        'email': 'moyerock@gmail.com',
        'avatar': 'https://lh3.googleusercontent.com/-AxuH90mY9tY/AAAAAAAAAAI/AAAAAAAAAAA/8kSyughgw6o/s96-c/photo.jpg'
    };
}
/*
 get user by userid
 */
module.exports.getUserById = function (session, id, callback) {
    if (config.isDevelopment()) {
        return callback(null, generateDevUser());
    } else {
        return Q.fcall(session.getById(id, 'user')).then(function (err, reply) {
            return callback(err, JSON.parse(reply));
        });
    }
};
/*
 get current user
 */
module.exports.getUser = function (session, req, callback) {
    if (config.isDevelopment()) {
        return callback(null, generateDevUser());
    } else {
        session.get(req, 'user', function (err, reply) {
            return callback(err, JSON.parse(reply));
        });
    }
};