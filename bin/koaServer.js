var koa = require('koa');
var mount = require('koa-mount');
var app = koa();

app.use(mount('/hello', function *(next) {
    yield next;
    this.body = 'Hello world.';
}));

app.use(function *(next){
    console.log(this.cookies.get('session_id'));
    console.log(this.ip);
    yield next;
});

app.use(function *(){
    this.set('Content-Type', 'text/html');
    //this.throw(401);
});

app.listen(3000);
