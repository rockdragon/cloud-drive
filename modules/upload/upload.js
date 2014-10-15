module.exports.bind = function (server) {
    var io = require('socket.io').listen(server);
    io.sockets.on('connection', function (client) {
        console.log('a client connection established: ' + client.id);

        client.send((new Date()).getTime());

        client.on('message', function(message){
            console.log('received message: ' + message);
        });
    });
};
