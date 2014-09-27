var passport = require('passport')
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var config = require('../config/configUtils');

passport.use(new GoogleStrategy({
        authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
        tokenURL: 'https://accounts.google.com/o/oauth2/token',
        clientID: config.getConfigs().GOOGLE_CLIENT_ID,
        clientSecret: config.getConfigs().GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://www.fun4.tv:3000/auth/google/return'
    },
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

module.exports.passport = passport;