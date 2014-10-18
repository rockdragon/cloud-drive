var path = require('path');
var fs = require('fs');

module.exports.mkdirAbsoluteSync = function (dirPath, mode) {
    dirPath = dirPath.trim('/');
    var currentPath = '';
    var pathParts = dirPath.split('\/');
    if (pathParts.length >= 2) {
        for (var i = 1; i < pathParts.length; i++) {
            currentPath += '/' + pathParts[i];
            if (!fs.existsSync(currentPath)) {
                console.log('creating: ' + currentPath);
                fs.mkdirSync(currentPath, mode || 0755);
            }
        }
    }
};
