const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    email : {
        type: String,
        required:true,
        unique: true
    },
    password : {
        type : String,
        required:true
    },
    phone : {
        type : Number,
        required :true,
        unique : true
    },
    avatar : String,
    isAdmin : {
        type : Boolean,
        default:false
    }
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);