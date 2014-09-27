var passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//Use google strategy
passport.use(new GoogleStrategy({
        returnURL: 'http://www.example.com/auth/google/return',
        realm: 'http://www.example.com/'
    },
    function(identifier, profile, done) {
        User.findOrCreate({ openId: identifier }, function(err, user) {
            done(err, user);
        });
    }
));

module.exports.passport = passport;