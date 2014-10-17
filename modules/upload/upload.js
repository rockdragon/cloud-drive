var userUtils = require('../auth/userUtils');
var path = require('path');

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
                fs.open(filePath, 'a', 0755, function (err, fd) {
                    if (err)
                        console.log('file open error: ' + err.toString());
                    else {
                        Files[name].handler = fd;
                        socket.emit('moreData', {position: position, percent: 0});
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
            if(Files[name].downloaded === Files[name].fileSize){
                fs.write(Files[name].handler, Files[name].data, null, 'Binary', function(err, written){
                    if(err)
                        console.log('file write error: ' + err.toString());
                    delete Files[name];
                });
            }
        });
    });
};
