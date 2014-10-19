var mongoUtils = require('./mongoUtils');
var userUtils = require('../auth/userUtils');

module.exports.saveStorage = function (session, req, storage, callback) {
    userUtils.getUser(session, req, function (err, reply) {
        if (reply) {
            var user = JSON.parse(reply);

            mongoUtils.connect();
            mongoUtils.findUserStorage(user.type, user.userid, function (err, record) {
                if (record) { // exist record
                    record.storage = storage;
                    mongoUtils.updateUserStorage(record, function (err) {
                    });
                } else { // new record
                    mongoUtils.saveUserStorage(user.type, user.userid, storage, function (err) {
                    });
                }
                mongoUtils.disconnect();
                callback(null);
            });
        } else
            callback(new Error('user not found.'));
    });
};

module.exports.getStorageRecord = function (session, req, callback) {
    userUtils.getUser(session, req, function (err, reply) {
        if (reply) {
            var user = JSON.parse(reply);

            mongoUtils.connect();
            mongoUtils.findUserStorage(user.type, user.userid, function (err, record) {
                mongoUtils.disconnect();

                callback(err, record);
            });
        } else
            callback(new Error('user not found.'), null);
    });
};
