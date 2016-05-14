const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./../models/user');

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID || 'random',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'random',
            callbackURL: 'http://localhost:5000/auth/google/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({
                'google.id': profile.id
            }, (err, user) => {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        photos: profile.photos[0].value,
                        username: profile.username,
                        provider: 'google',
                        google: profile._json
                    });

                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    ));

    passport.serializeUser(function(user, cb) {
        cb(null, user._id);
    });

    passport.deserializeUser(function(_id, cb) {
        User.findOne({_id}, (err, user) => {
            cb(err, user);
        });
    });
};