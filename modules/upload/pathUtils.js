var path = require('path');
var fs = require('fs');

/*
 recursive create directory
    @dirPath: absolute path
 */
module.exports.mkdirAbsoluteSync = function (dirPath, mode) {
    dirPath = dirPath.trim('/');
    var currentPath = '';
    var pathParts = dirPath.split('\/');
    for (var i = 0; i < pathParts.length; i++) {
        currentPath += '/' + pathParts[i];
        if (!fs.existsSync(currentPath)) {
            console.log('creating: ' + currentPath);
            fs.mkdirSync(currentPath, mode || 0755);
        }
    }
};
