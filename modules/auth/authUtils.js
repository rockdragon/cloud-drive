var passport = require('passport')
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

module.exports.passport = passport;