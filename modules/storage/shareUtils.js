var crypto = require('crypto');
var utility = require('../other/utility');
var configUtils = require('../config/configUtils');
var mongoUtils = require('./mongoUtils');
var storageUtils = require('./storageUtils');

var delimiter = '|';

/*
 @userType
 @userId
 @storageType folder/file
 @route (e.g. /folder/files)
 based on AES symmetrical cipher
 */
module.exports.generateShareLinkSync = function (userType, userId, storageType, route) {
    storageType = storageType === 'folder' ? storageType : 'file';
    var cipher = crypto.createCipher('aes-256-cbc', configUtils.getConfigs().SECRET);
    var concatenation = userType + delimiter + userId + delimiter + storageType + delimiter + route;
    var result = cipher.update(concatenation, 'utf8', 'hex');
    result += cipher.final('hex');
    return result;
};

/*
 @link: e.g. 4c3857df7d7420061939143435cbccd1a72cfe60e883816334e57f76782ac4d5
 based on AES symmetrical cipher
 @return {userType, userId, storageType, route}
 */
module.exports.fromSharedLinkSync = function (link) {
    try {
        var cipher = crypto.createDecipher('aes-256-cbc', configUtils.getConfigs().SECRET);
        var result = cipher.update(link, 'hex', 'utf8');
        result += cipher.final('utf8');
        console.log(result);
        if (result && result.contains(delimiter)) {
            var parts = result.split(delimiter);
            if (parts.length === 4) {
                return {
                    userType: parts[0],
                    userId: parts[1],
                    storageType: parts[2],
                    route: parts[3]
                };
            }
        }
    } catch (e) {
        console.log('shareUtils.fromSharedLinkSync occurs error:', e);
    }
    return null;
};

/*
 @userType
 @userId
 @storageType folder/file
 @route /pictures/ or /picture/1.file
 get specific-path storage userType & userId & route
 */
module.exports.getSpecificStorage = function (userType, userId, storageType, route, callback) {
    mongoUtils.findUserStorage(userType, userId, function (err, record) {
        if (record) {
            var finder = storageType === 'folder' ? storageUtils.findFolder : storageUtils.findFile;
            var storage = finder(record.storage, route);
            callback(err, storage);
        }
        callback(err, null);
    });
};