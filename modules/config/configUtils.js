var fs = require('fs');
var path = require('path');

var cfgFileName = 'config.cfg';
var cache = {};

module.exports.getConfigs = function () {
    if (!cache[cfgFileName]) {
        if (!process.env.cloudDriveConfig) {
            process.env.cloudDriveConfig = path.join(process.cwd(), cfgFileName);
        }
        if (fs.existsSync(process.env.cloudDriveConfig)) {
            var contents = fs.readFileSync(process.env.cloudDriveConfig, {encoding: 'utf-8'});
            cache[cfgFileName] = JSON.parse(contents);
            console.log('read configuration from ['+ cfgFileName + ']:' + contents);
        }
    }
    return cache[cfgFileName];
};

module.exports.isDevelopment = function(){
    return process.env.NODE_ENV  === 'development';
};

module.exports.getUploadRoot = function(){
    if(cache[cfgFileName].upload_setting && cache[cfgFileName].upload_setting[process.platform]){
        return cache[cfgFileName].upload_setting[process.platform];
    }
    return '/tmp';
};