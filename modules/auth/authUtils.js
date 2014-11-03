var passport = require('passport')
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , DoubanStrategy = require('passport-douban').Strategy
    , GithubStrategy = require('passport-github').Strategy;

var config = require('../config/configUtils');
var userUtils = require('./userUtils');

passport.use(new GoogleStrategy({
        authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
        tokenURL: 'https://accounts.google.com/o/oauth2/token',
        clientID: config.getConfigs().GOOGLE_CLIENT_ID,
        clientSecret: config.getConfigs().GOOGLE_CLIENT_SECRET,
        callbackURL: config.getConfigs().GOOGLE_RETURN_URL
    },
    function (accessToken, refreshToken, profile, done) {
        var userInfo = {
            'type': 'google',
            'userid': profile.id,
            'name': profile.displayName,
            'email': profile.emails[0].value,
            'avatar': profile._json.picture
        };
        return done(null, userInfo);
    }
));

passport.use(new FacebookStrategy({
        clientID: config.getConfigs().FACEBOOK_APP_ID,
        clientSecret: config.getConfigs().FACEBOOK_APP_SECRET,
        callbackURL: config.getConfigs().FACEBOOK_RETURN_URL,
        enableProof: false,
        profileFields: ['id', 'displayName', 'photos', 'emails']
    },
    function (accessToken, refreshToken, profile, done) {
        console.log('facebook profile: ' + JSON.stringify(profile));
        var userInfo = {
            'type': 'facebook',
            'userid': profile.id,
            'name': profile.displayName,
            'email': profile.emails[0].value,
            'avatar': profile.photos[0].value
        };
        return done(null, userInfo);
    }
));

passport.use(new DoubanStrategy({
        clientID: config.getConfigs().DOUBAN_APP_ID,
        clientSecret: config.getConfigs().DOUBAN_APP_SECRET,
        callbackURL: config.getConfigs().DOUBAN_RETURN_URL
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('douban profile: ' + JSON.stringify(profile));
        var userInfo = {
            'type': 'douban',
            'userid': profile.id,
            'name': profile.displayName,
            'email': profile.profileUrl,
            'avatar': profile.avatar
        };
        return done(null, userInfo);
    }
));

passport.use(new GithubStrategy({
        clientID: config.getConfigs().GIT_APP_ID,
        clientSecret: config.getConfigs().GIT_APP_SECRET,
        callbackURL: config.getConfigs().GIT_RETURN_URL
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('github profile: ' + JSON.stringify(profile));
        var userInfo = {
            'type': 'github',
            'userid': profile.id,
            'name': profile.displayName,
            'email': profile.emails[0].value,
            'avatar': profile.avatar
        };
        return done(null, userInfo);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

module.exports = function (app, session) {
    app.use(passport.initialize());

    app.get('/auth/google',
        passport.authenticate('google', {
            scope: 'https://www.google.com/m8/feeds' +
                ' https://www.googleapis.com/auth/userinfo.email' +
                ' https://www.googleapis.com/auth/userinfo.profile'
        }));

    app.get('/auth/google/return',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function (req, res) {
            if (req.user) {
                session.set(req, 'user', JSON.stringify(req.user), function (err, reply) {
                });
                res.redirect('/user?sid=' + req.cookies['session_id']);
            }
        });

    app.get('/auth/facebook',
        passport.authenticate('facebook', { failureRedirect: '/login', scope: ['email'] }));

    app.get('/auth/facebook/return',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function (req, res) {
            if (req.user) {
                session.set(req, 'user', JSON.stringify(req.user), function (err, reply) {
                });
                res.redirect('/user?sid=' + req.cookies['session_id']);
            }
        });

    app.get('/auth/github',
        passport.authenticate('github', { failureRedirect: '/login', scope: ['user'] }));

    app.get('/auth/github/return',
        passport.authenticate('github', { failureRedirect: '/login' }),
        function (req, res) {
            if (req.user) {
                session.set(req, 'user', JSON.stringify(req.user), function (err, reply) {
                });
                res.redirect('/user?sid=' + req.cookies['session_id']);
            }
        });

    app.get('/auth/douban',
        passport.authenticate('douban', { failureRedirect: '/login', scope: ['douban_basic_common'] }));

    app.get('/auth/douban/return',
        passport.authenticate('douban', { failureRedirect: '/login' }),
        function (req, res) {
            if (req.user) {
                session.set(req, 'user', JSON.stringify(req.user), function (err, reply) {
                });
                res.redirect('/user?sid=' + req.cookies['session_id']);
            }
        });

    //common middle procedure
    app.get('/user', function (req, res) {
        var id = req.query.sid;
        console.log('----- received temporary sid: ' + id);
        userUtils.getUserById(session, id, function (err, reply) {
            if (reply) {
                session.deleteById(id, 'session', function (err, reply) {
                });
                session.deleteById(id, 'user', function (err, reply) {
                });
                session.set(req, 'user', reply, function (err, reply) {
                });
            }
        });

        res.redirect('/');
    });
};

