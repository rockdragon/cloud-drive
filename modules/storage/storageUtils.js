var mongoUtils = require('./mongoUtils');
var userUtils = require('../auth/userUtils');
var mimeUtils = require('../mime/mimeUtils');
var moment = require('moment');
var _ = require('underscore');
var path = require('path');

var Rx = require('rx');

var getUser = Rx.Observable.fromNodeCallback(userUtils.getUser);
var getUserById = Rx.Observable.fromNodeCallback(userUtils.getUserById);
var findUserStorage = Rx.Observable.fromNodeCallback(mongoUtils.findUserStorage);
var updateUserStorage = Rx.Observable.fromNodeCallback(mongoUtils.updateUserStorage);
var saveUserStorage = Rx.Observable.fromNodeCallback(mongoUtils.saveUserStorage);
var errorOccurs = function (err) {
    console.log('Error: ' + err)
};

module.exports.saveStorageByUser = saveStorageByUser;
module.exports.saveStorage = saveStorage;
module.exports.getStorageRecordByUser = getStorageRecordByUser;
module.exports.getStorageRecord = getStorageRecord;
module.exports.addFolderBySessionId = addFolderBySessionId;
module.exports.addFileBySessionId = addFileBySessionId;
module.exports.addFile = addFile;
module.exports.deleteResourceById = deleteResourceById;
module.exports.findFolder = findFolder;
module.exports.findFile = findFile;

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

/*
 retrieve a user storage record
 */
function getStorageRecordByUser(user, callback) {
    var findUserStorageSync = findUserStorage(user.type, user.userid);
    findUserStorageSync.subscribe(
        function (record) {
            callback(null, record);
        }, errorOccurs);
}

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

/*
 add a folder to user's storage
 @parentRoute(etc.): home/second
 @folderName: third
 result: home/second/third
 */

function addFolderBySessionId(session, id, parentRoute, folderName, callback) {
    var getUserByIdAsync = getUserById(session, id);
    getUserByIdAsync.subscribe(function (reply) {
        if (reply) {
            var user = JSON.parse(reply);

            getStorageRecordByUser(user, function (err, record) {
                var storage = record.storage;
                var parentFolder = findFolder(storage, parentRoute);
                if (parentFolder) {
                    var folder = {
                        name: folderName,
                        path: path.join(parentFolder.path, folderName),
                        route: parentFolder.route + (parentFolder.route.endsWith('/') ? '' : '/') + folderName,
                        folders: [],
                        files: []
                    };
                    parentFolder.folders = parentFolder.folders || [];
                    parentFolder.folders.push(folder);

                    saveStorageByUser(user, storage, function (err) {
                        callback(err, folder);
                    });
                }
            });
        }
    }, errorOccurs);
}

module.exports.addFolder = function (session, req, parentRoute, folderName, callback) {
    var getStorageRecordWrapper = Rx.Observable.fromNodeCallback(getStorageRecord);
    var getStorageRecordSync = getStorageRecordWrapper(session, req);
    getStorageRecordSync.subscribe(
        function (record) {
            if (record) {
                var storage = record.storage;
                var parentFolder = findFolder(storage, parentRoute);
                if (parentFolder) {
                    var folder = {
                        name: folderName,
                        path: path.join(parentFolder.path, folderName),
                        route: path.join(parentFolder.route, folderName),
                        folders: [],
                        files: []
                    };
                    parentFolder.folders = parentFolder.folders || [];
                    parentFolder.folders.push(folder);

                    saveStorage(session, req, storage, function (err) {
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
function addFileBySessionId(session, id, parentRoute, file, callback) {
    var getUserByIdAsync = getUserById(session, id);
    getUserByIdAsync.subscribe(function (reply) {
        if (reply) {
            var user = JSON.parse(reply);
            getStorageRecordByUser(user, function (err, record) {
                var storage = record.storage;
                var parentFolder = findFolder(storage, parentRoute);
                if (parentFolder) {
                    file.mime = mimeUtils.lookup(file.name);
                    file.modified = moment().format("M/D/YYYY h:mm A");
                    parentFolder.files = parentFolder.files || [];
                    parentFolder.files.push(file);

                    saveStorageByUser(user, storage, function (err) {
                        callback(err);
                    });
                }
            });
        }
    }, errorOccurs);
}

function addFile(session, req, parentRoute, file, callback) {
    var getStorageRecordWrapper = Rx.Observable.fromNodeCallback(getStorageRecord);
    var getStorageRecordSync = getStorageRecordWrapper(session, req);
    getStorageRecordSync.subscribe(
        function (record) {
            if (record) {
                var storage = record.storage;
                var parentFolder = findFolder(storage, parentRoute);
                if (parentFolder) {
                    file.mime = mimeUtils.lookup(file.name);
                    file.modified = moment().format("M/D/YYYY h:mm A");
                    parentFolder.files = parentFolder.files || [];
                    parentFolder.files.push(file);

                    saveStorage(session, req, storage, function (err) {
                        callback(err);
                    });
                }
            }
        }, errorOccurs);
}

/*
 find folder by route
 */
function findFolder(storage, route) {
    if (!_.isArray(storage) && storage.route === route)
        return storage;
    else {
        var folders = storage.folders;
        if (folders && folders.length > 0) {
            for (var j = 0, len2 = folders.length; j < len2; j++) {
                if (folders[j].route === route) {
                    return folders[j];
                }
                var result = findFolder(folders[j].folders, route);
                if (result)
                    return result;
            }
        }
    }
    return null;
}
/*
 @route e.g. /1.file or /picture/1.file
 find file by route
 */
function findFile(storage, route) {
    var endIndex = route.lastIndexOf('/');
    if (endIndex > -1) {
        var folderRoute = route.substring(0, endIndex || 1);
        var folder = findFolder(storage, folderRoute);
        if (folder) {
            var fileName = route.substring(endIndex + 1);
            var file = _.find(folder.files, function (file) {
                return file.name === fileName
            });
            return file;
        }
    }
    return null;
}

/*
 delete specific resource from storage
 @resourceType file/folder
 */
function deleteResourceById(session, id, parentRoute, route, resourceType, callback){
    var getUserByIdAsync = getUserById(session, id);
    getUserByIdAsync.subscribe(function (reply) {
        if (reply) {
            var user = JSON.parse(reply);
            getStorageRecordByUser(user, function (err, record) {
                var storage = record.storage;
                var parentFolder = findFolder(storage, parentRoute);
                if (parentFolder) {
                    var collection = resourceType === 'folder' ? parentFolder.folders : parentFolder.files;
                    var index = -1;
                    for(var j = 0, len = collection.length; j<len;j++){
                        if(collection[j].route === route) {
                            index = j;
                            break;
                        }
                    }
                    if(index > -1) {
                        collection.splice(index, 1);
                        saveStorageByUser(user, storage, function (err) {
                            callback(err);
                        });
                    }
                }
            });
        }
    }, errorOccurs);
}

