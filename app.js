var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//redis session handler
var session = require('./modules/sessions/sessionUtils');
app.use(session());

//authentication
var passport = require('./modules/auth/authUtils').passport;
app.use(passport.initialize());
app.get('/auth/google',
    passport.authenticate('google', {
        scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
    }),
    function (req, res) {
    });

app.get('/auth/google/return',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });

//routers
var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
app.use('/', routes);
app.use('/users', users);
app.use('/login', login);

var config = require('./modules/config/configUtils');
app.get('/auth/google', function (req, res) {
    var options = [
        'https://accounts.google.com/o/oauth2/auth?response_type=code',
        '&redirect_uri=http://www.fun4.tv:3000/auth/google/return',
        '&scope=email%20profile',
            '&client_id=' + config.getConfigs().GOOGLE_CLIENT_ID
    ];
    res.redirect(options.join(''));
});

//var url = require('url');
//var http = require('http');
//app.get('/auth/google/return', function (req, res, next) {
//    var code = url.parse(req.url, true).query.code;
//    console.log('code: ' + code);
//    var postBody = [
//            'code=' + encodeURIComponent(code) + '&\n',
//            'client_id=' + encodeURIComponent(config.getConfigs().GOOGLE_CLIENT_ID) + '&\n',
//            'client_secret=' + encodeURIComponent(config.getConfigs().GOOGLE_CLIENT_SECRET) + '&\n',
//            'redirect_uri='+ encodeURIComponent('http://www.fun4.tv:3000/auth/google/return') + '&\n',
////        '&redirect_uri=http://www.fun4.tv:3000/auth/google/return',
//        'grant_type=authorization_code'
//    ];
//    postBody = postBody.join('');
//    console.log('postBody: \n' + postBody);
//    var options = {
//        host: 'accounts.google.com',
//        port: 443,
//        path: '/o/oauth2/token',
//        method: 'POST',
//        headers: {
//            'Host': 'accounts.google.com',
//            'Content-Type': 'application/x-www-form-urlencoded',
//            'User-Agent': 'Node-oauth',
//            'Content-Length': postBody.length
//        }
//    };
//    console.log('options:\n' + JSON.stringify(options));
//    var request = http.request(options, function (res) {
//        console.log('STATUS: ' + res.statusCode);
//        console.log('HEADERS: ' + JSON.stringify(res.headers));
//        res.setEncoding('utf8');
//        res.on('data', function (chunk) {
//            console.log('BODY: ' + chunk);
//        });
//    });
//    request.on('error', function (e) {
//        console.log('problem with request: ' + e.message);
//    });
//    request.write(postBody);
//    request.end();
//});
//app.post('/auth/google/return', function (req, res) {
//    console.log(req);
//});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
