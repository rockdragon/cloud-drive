var fs = require('fs');
var path = require('path');
var userUtils = require('../auth/userUtils');
var pathUtils = require('./pathUtils');

module.exports.bind = function (server) {
    var Files = {};

    var io = require('socket.io').listen(server);
    var respTime = function (socket) {
        socket.send((new Date()).getTime());
    };

    io.sockets.on('connection', function (socket) {
        console.log('a client connection established: ' + socket.id);

        respTime(socket);

        socket.on('message', function (message) {
            console.log('received message: ' + message);
        });

        //starting upload
        socket.on('start', function (data) {
            var name = data.Name;
            var size = data.Size;
            var sessionId = data.SessionId;
            console.log('received start event: %s, size: %d, session: %s', name, size, sessionId);

            //combine path
            userUtils.getUserRootPath(sessionId, function (err, userRootPath) {
                Files[name] = {
                    fileSize: size,
                    data: '',
                    downloaded: 0,
                    handler: null
                };
                Files[name].getPercent = function () {
                    return (this.downloaded / this.fileSize) * 100;
                };
                Files[name].getPosition = function () {
                    return this.downloaded / 524288;
                };
                var position = 0;
                try {
                    var filePath = path.join(userRootPath, name);
                    console.log('sessionId: %s, uploading: %s ...', sessionId, filePath);
                    var stat = fs.statSync(filePath);
                    if (stat.isFile()) {
                        Files[name].download = stat.size;
                        position = stat.size;
                    }
                } catch (err) {
                }
                var filePathAbsolute = path.dirname(filePath);
                if (!fs.exists(filePathAbsolute)) {
                    pathUtils.mkdirAbsoluteSync(filePathAbsolute);
                }
                fs.open(filePath, 'a', 0755, function (err, fd) {
                    if (err)
                        console.log('file open error: ' + err.toString());
                    else {
                        Files[name].handler = fd;
                        socket.emit('moreData', {'position': position, 'percent': 0});
                    }
                });
            });
        });
        //uploading
        socket.on('upload', function (data) {
            var name = data.Name;
            var segment = data.Segment;
            var sessionId = data.SessionId;
            console.log('received upload event: %s, length: %d, session: %s', name, segment.length, sessionId);

            Files[name].downloaded += segment.length;
            Files[name].data = segment;
            if (Files[name].downloaded === Files[name].fileSize) {
                fs.write(Files[name].handler, Files[name].data, null, 'Binary', function (err, written) {
                    if (err)
                        console.log('file write error: ' + err.toString());
                    delete Files[name];
                    socket.emit('done', {name: name});
                });
            } else if (Files[name].data.length > 10485760) { //If the Data Buffer reaches 10MB
                fs.write(Files[name].handler, Files[name].data, null, 'Binary', function (err, Writen) {
                    if (err)
                        console.log('file write error: ' + err.toString());
                    Files[name].data = ""; //Reset The Buffer
                    socket.emit('moreData', {
                        'position': Files[name].getPosition(),
                        'percent': Files[name].getPercent() });
                });
            }
            else {
                socket.emit('moreData', {
                    'position': Files[name].getPosition(),
                    'percent': Files[name].getPercent() });
            }

        });
    });
};
