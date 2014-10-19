var winston = require('winston');
var path = require('path');
var logFile = path.join(process.cwd(), 'logs/access.log');

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

module.exports = logger;