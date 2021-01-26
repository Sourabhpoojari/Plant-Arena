const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user : {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    },
    product :[
         {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ],
    quantity : {
        type:Number,
        required:true
    },
    price:Number,
    addedOn : {
        type:Date,
        default:Date.now()
    }
});


module.exports = mongoose.model('Cart',cartSchema);