var koa = require('koa');
var mount = require('koa-mount');
var fs = require('fs');
var path = require('path');
var app = koa();

var readFile = function(dir){
    return function(fn){
        fs.readFile(dir, {encoding: 'utf8', flag: 'r'}, fn);
    };
};

app.use(mount('/', function *(next) {
    var data = yield next;
    this.body = data;
    console.log(this.ip);
}));

app.use(function *() {
    var filePath = path.join(process.cwd(), 'config.cfg');
    try {
        return yield readFile(filePath);
    } catch(e) {
        return this.body = e.message || "I'm dead"
    }
});

app.listen(3000);
