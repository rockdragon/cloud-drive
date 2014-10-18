var path = require('path');
var fs = require('fs');

module.exports.mkdirSync = function(dirpath, mode) {
    console.log(dirpath);
    dirpath.split('\/').reduce(function(pre, cur) {
        console.log('pre: ' + pre, 'cur: ' + cur);
        var p = path.join(pre, cur);
        if(!fs.existsSync(p)) {
            console.log('creating: ' + p);
            fs.mkdirSync(p, mode || 0755);
        }
        return p;
    }, __dirname);
};
