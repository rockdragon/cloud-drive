var passport = require('passport')
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , FacebookStrategy = require('passport-facebook').Strategy;

var config = require('../config/configUtils');

passport.use(new GoogleStrategy({
        authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
        tokenURL: 'https://accounts.google.com/o/oauth2/token',
        clientID: config.getConfigs().GOOGLE_CLIENT_ID,
        clientSecret: config.getConfigs().GOOGLE_CLIENT_SECRET,
        callbackURL: config.getConfigs().GOOGLE_RETURN_URL
    },
    function (accessToken, refreshToken, profile, done) {
        var userInfo = {
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
        enableProof: false
    },
    function (accessToken, refreshToken, profile, done) {
        console.log('facebook profile: ' + JSON.stringify(profile));
        var userInfo = {};
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
            scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
        }),
        function (req, res) {
        });

    app.get('/auth/google/return',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function (req, res) {
            if (req.user) {
                session.set(req, 'user', JSON.stringify(req.user), function (err, reply) {
                });
                res.redirect('/user?sid=' + req.cookies['session_id']);
            }
        });
    app.get('/user', function (req, res) {
        var id = req.query.sid;
        console.log('----- received temporary sid: ' + id);
        session.getById(id, 'user', function (err, reply) {
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

    app.get('/auth/facebook/return',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function (req, res) {
//        if(req.user){
//            session.set(req, 'user', JSON.stringify(req.user), function(err, reply){});
//            res.redirect('/user?sid=' + req.cookies['session_id']);
//        }
        });

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });
};