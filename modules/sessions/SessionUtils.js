var crypto = require('crypto');
var config = require('../config/configUtils');

var EXPIRES = 20 * 60 * 1000;

var openClient = function(){
    var client = require('redis').createClient('6379', '127.0.0.1');
    client.on('error', function(err){
        console.log(err);
    });
    return client;
};

var sign = function (val, secret) {
    return val + '.' + crypto
        .createHmac('sha1', secret)
        .update(val)
        .digest('base64')
        .replace(/\=+$/, '');
};
var generate = function () {
    var session = {};
    session.id = (new Date()).getTime() + Math.random().toString();
    session.id = sign(session.id, config.getConfigs().SECRET);
    session.expire = (new Date()).getTime() + EXPIRES;
    return session;
};
var serialize = function (name, val, opt) {
    var pairs = [name + '=' + encodeURIComponent(val)];
    opt = opt || {};

    if (opt.maxAge) pairs.push('Max-Age=' + opt.maxAge);
    if (opt.domain) pairs.push('Domain=' + opt.domain);
    if (opt.path) pairs.push('Path=' + opt.path);
    if (opt.expires) pairs.push('Expires=' + opt.expires);
    if (opt.httpOnly) pairs.push('HttpOnly');
    if (opt.secure) pairs.push('Secure');

    return pairs.join('; ');
};

var setHeader = function (req, res, next) {
    var writeHead = res.writeHead;
    res.writeHead = function () {
        var cookies = res.getHeader('Set-Cookie');
        cookies = cookies || [];
        var session = serialize(config.getConfigs().session_key, req.session.id);
        cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies, session];
        res.setHeader('Set-Cookie', cookies);
        return writeHead.apply(this, arguments);
    };

    next();
};

exports = module.exports = function session() {
    return function session(req, res, next) {
        var id = req.cookies[config.getConfigs().session_key];
        if (!id) {
            req.session = generate();
            id = req.session.id;
            var json = JSON.stringify(req.session);
            var client = openClient();
            client.hset(id, 'session', json, function (err) {
                if (err)
                    console.log(err);
                client.quit();
                setHeader(req, res, next);
            });
        } else {
            var client = openClient();
            client.hget(id, 'session', function (err, reply) {
                if (err)
                    console.log(err);
                var session = JSON.parse(reply);
                console.log(session);
                if (session && session.expire > (new Date()).getTime()) {
                    session.expire = (new Date()).getTime() + EXPIRES;
                    req.session = session;
                } else {
                    req.session = generate();
                    client.mset(id, req.session, function (err) {
                        if(err)
                            console.log(err);
                        client.quit();
                    });
                }

                client.quit();

                setHeader(req, res, next);
            });
        }
    };
};

module.exports.set = function(req, name, val){
    var id = req.cookies[config.getConfigs().session_key];
    if (id) {
        var client = openClient();
        client.hset(id, name, val, function (err) {
            if (err)
                console.log(err);
            client.quit();
        });
    }
};
module.exports.get = function(req, name, callback){
    var id = req.cookies[config.getConfigs().session_key];
    if (id) {
        var client = openClient();
        client.hget(id, name, function (err, reply) {
            callback(err, reply);
            client.quit();
        });
    }
};
