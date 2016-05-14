const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    photos: String,
    username: String,
    provider: String,
    google: Object
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
