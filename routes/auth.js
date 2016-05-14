const path = require('path');
const router = require('express').Router();
const passport = require('passport');

router.get('/auth', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../views/auth.html`));
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile email']
}));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth'
    }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.send(req.user);
    }
);

module.exports = router;
