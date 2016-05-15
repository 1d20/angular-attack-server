const path = require('path');
const request = require('request');
const router = require('express').Router();
const passport = require('passport');
const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('./../config');
const User = require('./../models/user');

router.get('/auth', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../views/auth.html`));
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

router.post('/auth/google', (req, res) => {
    const body = JSON.parse(req.body);

    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
        code: body.code,
        client_id: body.clientId,
        client_secret: config.GOOGLE_CLIENT_SECRET,
        redirect_uri: body.redirectUri,
        grant_type: 'authorization_code'
    };

    request.post(accessTokenUrl, {json: true, form: params}, function(err, response, token) {
        console.log('err', err, token);
        var accessToken = token.access_token;
        var headers = {Authorization: 'Bearer ' + accessToken};

        // Step 2. Retrieve profile information about the current user.
        request.get({url: peopleApiUrl, headers: headers, json: true}, function(err, response, profile) {
            if (profile.error) {
                return res.status(500).send({message: profile.error.message});
            }
            // Step 3a. Link user accounts.
            if (req.header('Authorization')) {
                User.findOne({google: profile.sub}, function(err, existingUser) {
                    if (existingUser) {
                        var token = createJWT(existingUser);
                        return res.send({token: token});
                    }
                    var token = req.header('Authorization').split(' ')[1];
                    var payload = jwt.decode(token, config.TOKEN_SECRET);

                    User.findById(payload.sub, function(err, user) {
                        if (!user) {
                            return res.status(400).send({message: 'User not found'});
                        }
                        user.google = profile.sub;
                        user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
                        user.displayName = user.displayName || profile.name;
                        user.save(function() {
                            var token = createJWT(user);
                            res.send({token: token});
                        });
                    });
                });
            } else {
                // Step 3b. Create a new user account or return an existing one.
                User.findOne({google: profile.sub}, function(err, existingUser) {
                    if (existingUser) {
                        return res.send({token: createJWT(existingUser)});
                    }
                    var user = new User();
                    user.google = profile.sub;
                    user.picture = profile.picture.replace('sz=50', 'sz=200');
                    user.displayName = profile.name;
                    user.save(function(err) {
                        var token = createJWT(user);
                        res.send({token: token});
                    });
                });
            }
        });
    });
});

module.exports = router;

function createJWT(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}
