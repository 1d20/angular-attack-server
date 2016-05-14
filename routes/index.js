module.exports = require('express').Router()
    .use(require('./auth'))
    .use(require('./users'));