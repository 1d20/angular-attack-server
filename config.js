module.exports = {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/angular-attack',
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'secret',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'secret'
};