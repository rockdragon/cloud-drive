var hashringUtils = require('../hashring/hashringUtils'),
    ring = hashringUtils.ring,
    node = hashringUtils.node;

var config = require('../config/configUtils');

var nodes = config.getConfigs().nodes;
for (var i = 0, len = nodes.length; i < len; i++) {
    var n = nodes[i];
    nodes[i] = new node({address: n.address, port: n.port});
}

var hashingRing = new ring(32, nodes);
module.exports = hashingRing;