const mongoose = require('mongoose');


//this is a kind of model should look like this
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId ,ref:'Product' ,required:true },
    quantity:{ type : Number ,default:1}

})

//mongoose model takes two params first name in Uppercase first letter and then schema  
module.exports = mongoose.model('Order', orderSchema);

