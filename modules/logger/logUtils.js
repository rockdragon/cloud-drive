var winston = require('winston');
var path = require('path');
var fs = require('fs');
var pathUtils = require('../upload/pathUtils');
var logPath = path.join(process.cwd(), 'logs/'),
    logFile = path.join(logPath, 'access.log');

if(!fs.existsSync(logPath)){
    pathUtils.mkdirAbsoluteSync(logPath);
}

var logger = new (winston.Logger)({
    transports:[
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            filename: logFile,
            timestamp: 'true',
            maxsize: 10485760,
            maxFiles: 10
        })
    ]
});

/*
    supply a integration of console-logger and file-logger
* */
module.exports.log = function(msg){
    logger.info(msg);
};