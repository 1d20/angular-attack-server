const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');

const dotenv = require('dotenv');

dotenv.config();

const auth = require('./auth');

auth(passport);

const mongoose = require('./connect');
const routes = require('./routes');

const port = process.env.PORT || 5000;

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'angular-attack',
    resave: true,
    saveUninitialized: true
}));

app.use(methodOverride());

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.all('*', (req, res) => {
    res.send('ok');
});

app.listen(port, () => {
    console.log('app started');
});

module.exports = app;
