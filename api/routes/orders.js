const express =require('express');
const router = express.Router();
const mongoose= require('mongoose')
const Order = require('../../models/order')
const Product = require('../../models/products'); //we are importing product so user can only enter valid product id 

router.get('/' , (req ,res ,next) => {
    Order.find().select('product quantity _id').exec()
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

    
    const order= new Order({
        _id :mongoose.Types.ObjectId(),
        quantity:req.body.quantity,
        product:req.body.productId
    })
//for save method we are actually having built in promise so we donot use exec() method while saving 
    order.save()
    .then(result => {
        res.status(201).json({
            message:"Record added successfully ",
            createdOrder:{
                _id:result._id,
                product:result.product,
                quantity:result.quantity
            },
            request:{
                type:"GET",
                url:"http://localhost:3000/orders/"+result._id
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    })
})


router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'orders Id details',
        id:req.params.orderId
    })
})

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: `order ${req.params.orderId}  Id deleted`,
    })
})



module.exports = router;
