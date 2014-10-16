var userUtils = require('../auth/userUtils');

module.exports.bind = function (server) {
    var io = require('socket.io').listen(server);
    var respTime = function(socket){
        socket.send((new Date()).getTime());
    };
    io.sockets.on('connection', function (socket) {
        console.log('a client connection established: ' + socket.id);

        respTime(socket);

        socket.on('message', function(message) {
            console.log('received message: ' + message);
        });

        socket.on('start', function(data){
            console.log('uploading %s, size: %d, session: %s', data['Name'], data['Size'], data['SessionId']);

            userUtils.getUserRootPath(data['SessionId'], function(err, path) {
                console.log(path);
            });

            respTime(socket);
        });
        socket.on('upload', function(data){
            console.log('uploading %s, size: %d', data['Name'], data['Size']);
            respTime(socket);
        });
    });
};
