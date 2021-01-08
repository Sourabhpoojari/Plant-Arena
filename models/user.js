const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,

        unique: true
    },
    password: {
        type: String
    },
    phone: {
        type: Number,

        unique: true
    }
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);