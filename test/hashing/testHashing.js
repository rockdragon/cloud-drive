var hashringUtils = require('../../modules/hashring/hashringUtils'),
    ring = hashringUtils.ring,
    node = hashringUtils.node;

var nodes = [ new node({address: '127.0.0.1', port: '6379'})
    , new node({address: '186.47.20.1', port: '6379'})
];
var hashingRing =  new ring(11, nodes);
console.log('---------initial two nodes');
console.log(hashingRing);

hashingRing.add(new node({address: '192.168.1.100', port: '6379'}));
console.log('---------three nodes');
console.log(hashingRing);

var key = '14115601500540.0095046809874475.M44CR%2BmZYEM3l3RIwwASd47C1jg';
var selected = hashingRing.select(key);
console.log(selected);
selected = hashingRing.select(9);
console.log(selected);


