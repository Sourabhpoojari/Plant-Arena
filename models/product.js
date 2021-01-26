var mongoose=require("mongoose");
var productSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    productImage:String,
    productDiscription:String,
    category : {
        type:String,
        required:true
    },
    price:Number,
    quantity : {
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=new mongoose.model("Product",productSchema);