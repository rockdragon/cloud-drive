/*
    consistent hashing algorithm
 */
var crypto = require('crypto');

var node = function (nodeOpts) {
    nodeOpts = nodeOpts || {};
    if (nodeOpts.address) this.address = nodeOpts.address;
    if (nodeOpts.port) this.port = nodeOpts.port;
};
node.prototype.toString = function(){
    return 'address:' + this.address + ', port:' + this.port;
};

var ring = function (maxNodes, realNodes) {
    this.nodes = [];
    this.maxNodes = maxNodes;
    this.realNodes = realNodes;

    var realLength = this.realNodes.length;
    var ringLength = realLength < this.maxNodes ? this.maxNodes : realLength;
    this.maxNodes = ringLength;
    for (var i = 0; i < ringLength; i++) {
        var idx = Math.floor(i / ringLength);
        this.nodes.push(realNodes[idx]);
    }
};
ring.compareNode = function (nodeA, nodeB) {
    return nodeA.address === nodeB.address &&
        nodeA.port === nodeB.port;
};
ring.hashCode = function(str){
    return parseInt(crypto.createHash('md5')
        .update(str)
        .digest('hex')
        .toString(), 16);
};
ring.prototype.select = function (key) {
    if(typeof key === 'string')
        key = ring.hashCode(key);
    var idx = key % this.maxNodes;
    return this.nodes[idx];
};
ring.prototype.add = function (node) {
    var nodesLength = this.nodes.length;
    var realLength = this.realNodes.length;

    var assignments = Math.floor(nodesLength / realLength / 2);
    if(assignments < 1)
        assignments = 1;
    for(var i = nodesLength - 1; i >= nodesLength - assignments; i--){
        this.nodes[i] = node;
    }

    this.realNodes.push(node);
};
ring.prototype.remove = function (node) {
    var realLength = this.realNodes.length;
    var idx = 0;
    for (var i = realLength; i--;) {
        var realNode = this.realNodes[i];
        if (ring.compareNode(realNode, node)) {
            this.realNodes.splice(i, 1);
            idx = i;
            break;
        }
    }
    var nodesLength = this.nodes.length;
    for (var i = nodesLength; i--;) {
        var nodeInRing = this.nodes[i];
        if (ring.compareNode(nodeInRing, node)) {
            nodeInRing.address = this.realNodes[idx].address;
            nodeInRing.port = this.realNodes[idx].port;
        }
    }
};
ring.prototype.toString = function(){
    return JSON.stringify(this.nodes);
};

module.exports.node = node;
module.exports.ring = ring;

