var mongoUtils = require('./mongoUtils');
var userUtils = require('../auth/userUtils');

var Rx = require('rx');

var getUser = Rx.Observable.fromNodeCallback(userUtils.getUser);
var findUserStorage = Rx.Observable.fromNodeCallback(mongoUtils.findUserStorage);
var updateUserStorage = Rx.Observable.fromNodeCallback(mongoUtils.updateUserStorage);
var saveUserStorage = Rx.Observable.fromNodeCallback(mongoUtils.saveUserStorage);
var errorOccurs = function (err) {
    console.log('Error: ' + err)
};

var getUserLogic = function (session, req, storage, callback, next) {
    var getUserSync = getUser(session, req);
    getUserSync.subscribe(
        function (reply) {
            if (reply) {
                var user = JSON.parse(reply);
                next(user, storage, callback);
            } else {
                callback(new Error('user not found.'));
            }
        }, errorOccurs
    );
};

var findUserStorageLogic = function (user, storage, callback) {
    var done = function () {
        callback(null);
    };
    var findUserStorageSync = findUserStorage(user.type, user.userid);
    findUserStorageSync.subscribe(
        function (record) {
            if (record) { // exist record
                record.storage = storage;
                var updateUserStorageSync = updateUserStorage(record);
                updateUserStorageSync.subscribe(done, errorOccurs);
            } else { // new record
                var saveUserStorageSync = saveUserStorage(user.type, user.userid, storage);
                saveUserStorageSync.subscribe(done, errorOccurs);
            }
        }, errorOccurs);
};


module.exports.saveStorage = function (session, req, storage, callback) {

    getUserLogic(session, req, storage, callback, findUserStorageLogic);

};

module.exports.getStorageRecord = function (session, req, callback) {
    var getUserSync = getUser(session, req);

    getUserSync.subscribe(
        function (reply) {
            if (reply) {
                var user = JSON.parse(reply);

                var findUserStorageSync = findUserStorage(user.type, user.userid);
                findUserStorageSync.subscribe(
                    function (record) {
                        callback(null, record);
                    }, errorOccurs);
            } else {
                callback(new Error('user not found.'), null);
            }
        }, errorOccurs);
};
