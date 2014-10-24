var mongoUtils = require('./mongoUtils');
var userUtils = require('../auth/userUtils');
var mimeUtils = require('../mime/mimeUtils');
var moment = require('moment');

var Rx = require('rx');

var getUser = Rx.Observable.fromNodeCallback(userUtils.getUser);
var findUserStorage = Rx.Observable.fromNodeCallback(mongoUtils.findUserStorage);
var updateUserStorage = Rx.Observable.fromNodeCallback(mongoUtils.updateUserStorage);
var saveUserStorage = Rx.Observable.fromNodeCallback(mongoUtils.saveUserStorage);
var errorOccurs = function (err) {
    console.log('Error: ' + err)
};

/*
 add or update a user storage
 */
function saveStorageByUser(user, storage, callback) {
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
}
module.exports.saveStorageByUser = saveStorageByUser;

function saveStorage(session, req, storage, callback) {

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

    getUserLogic(session, req, storage, callback, saveStorageByUser);
}
module.exports.saveStorage = saveStorage;

/*
 retrieve a user storage record
 */
function getStorageRecordByUser(user, callback){
    var findUserStorageSync = findUserStorage(user.type, user.userid);
    findUserStorageSync.subscribe(
        function (record) {
            callback(null, record);
        }, errorOccurs);
};
module.exports.getStorageRecordByUser = getStorageRecordByUser;
function getStorageRecord(session, req, callback) {
    var getUserSync = getUser(session, req);

    getUserSync.subscribe(
        function (reply) {
            if (reply) {
                var user = JSON.parse(reply);

                getStorageRecordByUser(user, callback);
            } else {
                callback(new Error('user not found.'), null);
            }
        }, errorOccurs);
}
module.exports.getStorageRecord = getStorageRecord;

/*
 add a folder to user's storage
 @parentRoute(etc.): home/second
 @folderName: third
 result: home/second/third
 */
var findParent = function (folders, parentRoute) {
    if (folders && folders.length > 0) {
        for (var j = 0, len2 = folders.length; j < len2; j++) {
            if (folders[j].route === parentRoute) {
                return folders[j];
            }
            var result = findParent(folders[j].folders, parentRoute);
            if (result)
                return result;
        }
    }
    return null;
};
module.exports.addFolder = function (session, req, parentRoute, folderName, callback) {
    var getStorageRecordWrapper = Rx.Observable.fromNodeCallback(getStorageRecord);
    var getStorageRecordSync = getStorageRecordWrapper(session, req);
    getStorageRecordSync.subscribe(
        function (record) {
            if (record) {
                var storage = record.storage;
                var parentFolder = findParent(storage.folders, parentRoute);
                if (parentFolder) {
                    parentFolder.folders = parentFolder.folders || [];
                    parentFolder.folders.push({
                        name: folderName,
                        path: parentFolder.path + '/' + folderName,
                        route: parentFolder.route + '/' + folderName,
                        folders: [],
                        files: []
                    });

                    saveStorage(session, req, storage, function(err){
                        callback(err);
                    });
                }
            }
        }, errorOccurs);
};

/*
 add a file to user's storage
 @parentRoute(etc.): home/second
 @file: a file object {
     name: '2.zip',
     path: '/users/moye/2.zip',
     size: '2.1M',
     suffix: 'zip',
 }
 */
module.exports.addFile = function (session, req, parentRoute, file, callback) {
    var getStorageRecordWrapper = Rx.Observable.fromNodeCallback(getStorageRecord);
    var getStorageRecordSync = getStorageRecordWrapper(session, req);
    getStorageRecordSync.subscribe(
        function (record) {
            if (record) {
                var storage = record.storage;
                var parentFolder = findParent(storage.folders, parentRoute);
                if (parentFolder) {
                    file.mime = mimeUtils.lookup(file.name);
                    file.modified = moment().format("M/D/YYYY h:mm A");
                    parentFolder.files = parentFolder.files || [];
                    parentFolder.files.push(file);

                    saveStorage(session, req, storage, function(err){
                        callback(err);
                    });
                }
            }
        }, errorOccurs);
};

