const DB = process.env.MONGODB_URI || 'mongodb://localhost/angular-attack';
const mongoose = require('mongoose');

mongoose.connect(DB);

module.exports = mongoose;