var crypto = require('crypto');
var utility = require('../other/utility');
var configUtils = require('../config/configUtils');
var delimiter = '|';

/*
 @userType
 @userId
 @route (e.g. /folder/files)
 based on AES symmetrical cipher
 */
module.exports.generateShareLinkSync = function (userType, userId, route) {
    var cipher = crypto.createCipher('aes-256-cbc', configUtils.getConfigs().SECRET);
    var concatenation = userType + delimiter + userId + delimiter + route;
    var result = cipher.update(concatenation, 'utf8', 'hex');
    result += cipher.final('hex');
    return result;
};

/*
 @link: e.g. 4c3857df7d7420061939143435cbccd1a72cfe60e883816334e57f76782ac4d5
 based on AES symmetrical cipher
 @return {userType, userId, route}
 */
module.exports.fromSharedLinkSync = function (link) {
    try {
        var cipher = crypto.createDecipher('aes-256-cbc', configUtils.getConfigs().SECRET);
        var result = cipher.update(link, 'hex', 'utf8');
        result += cipher.final('utf8');
        console.log(result);
        if (result && result.contains(delimiter)) {
            var parts = result.split(delimiter);
            if (parts.length === 3) {
                return {
                    userType: parts[0],
                    userId: parts[1],
                    route: parts[2]
                };
            }
        }
    }catch (e) {
        console.log('shareUtils.fromSharedLinkSync occurs error:', e);
    }
    return null;
};