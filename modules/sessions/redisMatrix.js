var hashringUtils = require('../hashring/hashringUtils'),
    ring = hashringUtils.ring,
    node = hashringUtils.node;

var config = require('../config/configUtils');

//default key expire, a week long
var EXPIRES = 7 * 24 * 60 * 60;

var nodes = config.getConfigs().nodes;
for (var i = 0, len = nodes.length; i < len; i++) {
    var n = nodes[i];
    nodes[i] = new node({address: n.address, port: n.port});
}

var hashingRing = new ring(32, nodes);

module.exports = hashingRing;
module.exports.openClient = function (id) {
    var node = hashingRing.select(id);
    var client = require('redis').createClient(node.port, node.address);
    client.on('error', function (err) {
        console.log('error: ' + err);
    });
    return client;
};
module.exports.hgetRedis = function (id, key, callback) {
    var client = hashingRing.openClient(id);
    client.hget(id, key, function (err, reply) {
        if (err)
            console.log('hget error:' + err);
        client.quit();
        callback.call(null, err, reply);
    });
};
module.exports.hsetRedis = function (id, key, val, callback) {
    var client = hashingRing.openClient(id);
    client.hset(id, key, val, function (err, reply) {
        if (err)
            console.log('hset ' + key + 'error: ' + err);
        console.log('hset [' + key + ']:[' + val + '] reply is:' + reply);

        client.quit();

        //default expire
        hashingRing.expire(id, EXPIRES);

        callback.call(null, err, reply);
    });
};
module.exports.hdelRedis = function(id, key, callback){
    var client = hashingRing.openClient(id);
    client.hdel(id, key, function (err, reply) {
        if (err)
            console.log('hdel error:' + err);
        client.quit();
        callback.call(null, err, reply);
    });
};
module.exports.expire = function(id, expireSeconds){
    var client = hashingRing.openClient(id);
    client.expire(id, expireSeconds, function(err, reply){
        if (err)
            console.log('expire ' + id + 'error: ' + err);
        console.log('expire [' + id + ']:[' + expireSeconds + '] reply is:' + reply);
    });
};
