const express =require('express');
const router = express.Router();
const mongoose= require('mongoose')
const Order = require('../../models/order')
const Product = require('../../models/products'); //we are importing product so user can only enter valid product id 

router.get('/' , (req ,res ,next) => {
    //here we are using populate for having additional information for only reference given variable like product in order schema 
    Order.find().select('product quantity _id')
    .populate('product' ,"name") //it automatically inserted product element as an object and and if we want some specific things we can also do that like we want only name if we donot write name it  fetchg whole relevant object  
    .exec()
        .then(result => {
            res.status(201).json({
                count:result.length,
                orders:result.map((item) =>{
                    return {
                        _id:item._id,
                        product:item.product,
                        quantity:item.quantity,
                        request:{
                            type:"GET",
                            url:"http://localhsot:3000/orders" +item._id
                        }
                    }
                })
              
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', (req, res, next) => {
Product.findById(req.body.productId)
      .then(product =>{

        if (!product){
            return res.status(404).json({
                message: 'Product not found!'
            });
        }
    
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    //for save method we are actually having built in promise so we donot use exec() method while saving 
    return order.save();
    }).then(result => {

        res.status(201).json({
            message: "Record added successfully ",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + result._id
            }
        })
    })    
    .catch(err => {
        res.status(500).json({
        })
    })
})


router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product') //it provides whole product object to the get request in product parameter 
    .exec()
    .then(order => {
        if(!order){
            res.status(404).json({message:"Requested order not found "})
        }
        res.status(200).json({
            order:order,
            request:{
                type:"GET",
                url:"http://localhost:3000/orders"
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    })
 
})

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId
    Order.remove({ _id: id }).exec().then(result => {
        res.status(200).json({
            message: "order  deleted successfully"
        })
    })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}) 

module.exports = router;
