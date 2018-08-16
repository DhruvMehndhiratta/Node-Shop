const express = require('express');
const router = express.Router();
const Product = require('../../models/products'); //used to have schema object of product
const mongoose =  require('mongoose'); //for database connectivity

//now we will use this router const everywhere to specify type of api i.e get , post ,delete ,single id get

router.get('/' ,(req , res , next) => {
    //we can use queries like where  , limit , from after find() function to provide it desired result 
    Product.find().select("name price _id").exec().then(docs => {
        const response = {
            count: docs.length,
            products: docs.map((item,index) => {
                return {
                    name:item.name,
                    price:item.price,
                    id:item._id,
                    request:{
                        type:"GET",
                        url:'http://localhost:3000/products/' + item._id
                    }
                }
            })
        }
        console.log(docs , "all docs")
        res.status(200).json({response})
        
    })
    .catch(err => {
        console.log(err ,"error occurred while fetching details");
        res.status(500).json({error:err})
        
    })
})

//the first parameter is '/' because we have already declared actual path needed in app.js 

router.post('/', (req,res , next) => {
//here we are using new keyword to create new object to be posted
    const product = new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price
    })
    
    //save method is provided by mongoose to store data into database and exec() method we are using it to use it as a promise 
    product.save().then(result => {
        console.log(result ,"result ");
        res.status(201).json({
            message: 'Created product successfully ',
            createdProduct: {
                name:result.name,
                price:result.price,
                _id:result._id,
                request:{
                    type: "GET",
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        })
        
    }).catch(err => {
        console.log(err ,"error occured");
        res.status(500).json({
            error:err
        })
        
    })
    //we are having body option in request with  name on rhs means we are expecting the name key when we send data
    
})


router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    //this is for some special case if we want 
    //id is accessible in request.params.name we provided to it initally while declaring 
  //Product is a object which we have imported and findById is used to find id as name suggest 
    Product.findById(id).select('name price _id')
    // .select('name price _id') we can use to take how many fields are having need
    .exec()
    .then(doc => {
        console.log(doc ,"response ");
        //here if and else is checking the invalid id entered or  not 
        if(doc){
            res.status(200).json({ doc,request:{
                type:'GET',
                "url":"http://localhost:3000/products"
            } }); //used to return status with result 
        }
        else{
            res.status(404).json( {message:'No valid entry found'})
        }
      
    })
    .catch(err =>{
        console.log(err ,"error occured");
        res.status(500).json({error:err})
    })
   
}) 


router.patch('/:productId', (req, res, next) => {
 const id = req.params.productId
 const updateOps = {};//this is the object that we will dispatch with request
    for(const ops of req.body){ //for loop used ops means all operations through requested body
        updateOps[ops.propName]=ops.value ; //we used it to change only those params which are we changing or if we are not changing it will return as it is 
    }

 //update takes two parameter first the id and second is the full object that needs to be changed which is updateOps in this case 
 // set is inbuilt function of  mongoose to patch details
 Product.update({_id:id},{$set:updateOps}).exec().then(result => {
     res.status(200).json({
         message:"Product successfully updated",
         request:{
             type:"Get",
             url:"http://localhost:3000/products/"+id
         }
     })
 })
 .catch(err => {
     console.log(err ,"error occurred during patch");
     res.status(500).json({error:err})
 })
//for how to use postman for patch  :- if we are directly putting it into body it will give error req.body is not iterable we have to use it like: -  [ { "propName":"name" ,"value":"harry porter 6"}]
}) 

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId
  Product.remove({_id :id}).exec().then(result => {
      console.log('deleted product id')
    res.status(200).json({
        message:"product deleted successfully"
    })
  })
  .catch(err => {
    res.status(500).json({error:err})
  })
}) 

module.exports = router;
