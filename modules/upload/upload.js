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

    var onCompleted = function (parent, name, filePath, size) {

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
            var currentPath = data.CurrentPath;
            console.log('[start] received start event: %s, size: %d, session: %s', name, size, sessionId);

            //combine path
            userUtils.getUserRootPath(sessionId, function (err, userRootPath) {
                Files[name] = { // define storage structure
                    fileSize: size,
                    data: '',
                    downloaded: 0,
                    handler: null,
                    filePath: path.join(userRootPath, name),
                    parent: currentPath
                };
                Files[name].getPercent = function () {
                    return parseInt((this.downloaded / this.fileSize) * 100);
                };
                Files[name].getPosition = function () {
                    return this.downloaded / 524288;
                };
                var position = 0;
                try {
                    console.log('[start] sessionId: %s, uploading: %s ...', sessionId, Files[name].filePath);
                    var stat = fs.statSync(Files[name].filePath);
                    if (stat.isFile()) {
                        Files[name].download = stat.size;
                        position = stat.size;
                    }
                } catch (err) {
                }
                var filePathAbsolute = path.dirname(Files[name].filePath);
                if (!fs.exists(filePathAbsolute)) { //ensure directory exist
                    pathUtils.mkdirAbsoluteSync(filePathAbsolute);
                }
                fs.open(Files[name].filePath, 'a', 0755, function (err, fd) {
                    if (err)
                        console.log('[start] file open error: ' + err.toString());
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
            console.log('[upload] received upload event: %s, segment length: %d, session: %s', name, segment.length, sessionId);

            Files[name].downloaded += segment.length;
            Files[name].data += segment;
            if (Files[name].downloaded === Files[name].fileSize) {
                fs.write(Files[name].handler, Files[name].data, null, 'Binary', function (err, written) {
                    if (err)
                        console.log('[upload] file write error: ' + err.toString());
                    //uploading completed
                    onCompleted(Files[name].parent, name, Files[name].filePath, Files[name].fileSize);

                    delete Files[name];
                    socket.emit('done', {name: name});
                });
            } else if (Files[name].data.length > 10485760) { //If the Data Buffer reaches 10MB
                fs.write(Files[name].handler, Files[name].data, null, 'Binary', function (err, Writen) {
                    if (err)
                        console.log('[upload] file write error: ' + err.toString());
                    Files[name].data = ''; //Reset The Buffer
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
