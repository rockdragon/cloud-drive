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
        if(req.user){
            session.set(req, 'user', JSON.stringify(req.user), function(err, reply){});
            res.redirect('/user?sid=' + req.cookies['session_id']);
        }
    });
app.get('/user', function(req, res){
    var id = req.query.sid;
    console.log('----- received temporary sid: ' + id);
    session.getById(id, 'user', function(err, reply){
        if(reply){
            var user = JSON.parse(reply);
            session.deleteById(id, 'session', function(err, reply){});
            session.deleteById(id, 'user', function(err, reply){});
            session.set(req, 'user', user, function(err, reply){});
        }
    });
    res.redirect('/');
});

//routers
var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
app.use('/', routes);
app.use('/users', users);
app.use('/login', login);

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
