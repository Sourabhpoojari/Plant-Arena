const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
 
    user : {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    },
    products: [
        {
            _id :{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product'
            },
            totalQuantity:Number,
            totalPrice:Number
        }
    ],
    orderedAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('Purchase',purchaseSchema);