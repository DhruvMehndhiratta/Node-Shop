const express =require('express');
const router = express.Router();

router.get('/' , (req ,res ,next) => {
    res.status(200).json({
        message:'orders were fetched'
    })
})


router.post('/', (req, res, next) => {
    const order={
        productId:req.body.productId,
        price:req.body.price
    }
    res.status(200).json({
        message: 'orders were created',
        order:order
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
