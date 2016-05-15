const express = require('express');
const cors = require('cors');
const moment = require('moment');
const jwt = require('jwt-simple');
const morgan = require('morgan');
const bodyParser = require('body-parser');
//const methodOverride = require('method-override');
//const session = require('express-session');
//const passport = require('passport');

const dotenv = require('dotenv');

dotenv.config();

//const auth = require('./auth');

//auth(passport);

const mongoose = require('./connect');
const routes = require('./routes');

const port = process.env.PORT || 5000;

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.text({type: 'text/plain'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//app.use(session({
//    secret: 'angular-attack',
//    resave: true,
//    saveUninitialized: true
//}));
//
//app.use(methodOverride());
//
//app.use(passport.initialize());
//app.use(passport.session());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/public'));
} else {
    app.use(express.static(__dirname + '/../../angularattack2016-1D20/dist/dev'));
    app.use('/dist', express.static(__dirname + '/../../angularattack2016-1D20/dist/dev'));
    app.use('/node_modules', express.static(__dirname + '/../../angularattack2016-1D20/node_modules'));
}

app.use(routes);

app.all('*', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        res.sendFile(require('path').resolve(`${__dirname}/public/index.html`));
    } else {
        res.sendFile(require('path').resolve(`${__dirname}/../../angularattack2016-1D20/dist/dev/index.html`));
    }
});

app.listen(port, () => {
    console.log('app started');
});

module.exports = app;
