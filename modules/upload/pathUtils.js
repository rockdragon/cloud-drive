var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var utility = require('../other/utility');
/*
 recursive create directory
    @dirPath: absolute path
 */

module.exports.mkdirAbsoluteSync = function (dirPath, mode) {
    var delimiter = path.sep;
    dirPath = dirPath.trim(delimiter);
    var currentPath = '';
    var pathParts = dirPath.split(delimiter);
    for (var i = 0; i < pathParts.length; i++) {
        currentPath += (utility.isWin() && pathParts[i].contains(':') ? '' : delimiter) + pathParts[i];
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath, mode || 0755);
        }
    }
};

/*
 recursive delete path entirely
 @dirPath: absolute path
 */
module.exports.deleteTreeSync = function(dirPath){
    if(fs.existsSync(dirPath)) {
        rimraf.sync(dirPath);
    }
};
