const restify = require('express-restify-mongoose');
const router = require('express').Router();

const UserModel = require('../models/user');

restify.serve(router, UserModel);

module.exports = router;
