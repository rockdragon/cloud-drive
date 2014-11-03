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

module.exports.renameSync = function(dirPath, newName){
    console.log(dirPath, newName);
    if(fs.existsSync(dirPath)){
        var dir = path.dirname(dirPath);
        var newPath = path.join(dir, newName);
        fs.renameSync(dirPath, newPath);
        return newPath;
    }
};

/*
    concatenate part with slash /
* */
function join(){
    var args = Array.prototype.slice.call(arguments);
    args = args || [];
    if(args.length > 1){
        return  args.join('/').replace(/[\/]{2,}/g, '/');
    }
    return '';
}
module.exports.join = join;
