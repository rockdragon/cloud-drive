var hashringUtils = require('../hashring/hashringUtils'),
    ring = hashringUtils.ring,
    node = hashringUtils.node;

var nodes = [
    new node({address: '127.0.0.1', port: '6379'})
];

var hashingRing = new ring(32, nodes);
module.exports = hashingRing;