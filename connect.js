const DB = process.env.MONGO_DB || 'mongodb://localhost/angular-attack';
const mongoose = require('mongoose');

mongoose.connect(DB);

module.exports = mongoose;