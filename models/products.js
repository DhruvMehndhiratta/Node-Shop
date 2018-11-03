const mongoose = require('mongoose');


//this is a kind of model should look like this
const productSchema =  mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type : String , required: true },
    price:{type :Number , required : true} ,
    productImage:{type:String ,required:true}
})

//mongoose model takes two params first name in Uppercase first letter and then schema  
module.exports = mongoose.model('Product' ,productSchema);

