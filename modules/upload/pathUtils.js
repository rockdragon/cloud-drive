var path = require('path');
var fs = require('fs');

module.exports.mkdirSync = function(dirpath, mode) {
    dirpath.split('\/').reduce(function(pre, cur) {
        var p = path.join(pre, cur);
        if(!fs.existsSync(p)) fs.mkdirSync(p, mode || 0755);
        return p;
    }, __dirname);
};
