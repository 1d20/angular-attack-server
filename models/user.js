const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    displayName: String,
    picture: String,
    google: String
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
