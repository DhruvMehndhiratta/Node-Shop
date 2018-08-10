const express = require('express');
const morgan =require('morgan');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');


//importing router of api' 
const productRoute =require('./api/routes/products');
const orderRoute = require('./api/routes/orders');

mongoose.connect('mongodb://node-shop:node123@ds117362.mlab.com:17362/node-shop')

//morgan  is a kind of middleware where all api calls pass through it and which provides console of type of api with url and status of api call and we have to use it before api call like below is api call so we have used it just above it 
//morgan is also equivalent to next function of 3 parameter where we called our api it said it will do nothing you guys carry on with work i will just log things
app.use(morgan('dev'));
//body parser is used for the post request body parsing for now we are handling urlencoded with extended false(to handle  less data) json and json handler which is just a function 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//this below code is used to allow CORS
app.use((req, res ,next) => {
    res.header('Access-Control-Allow-Origin' , "*");
    res.header(
        "Access-Control-Allow-Headers","*"
    );
    //we can also set header to *
    //browser first options for security purpose so we are allowing it and sending null json response 
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT ,POST ,PATCH , GET ,DELETE')
        return res.status(200).json({})//empty json for options 
    }
    next();
})

//app.use is a kind of middleware everything in response have to pass through it if we are not passing it through it will show empty response 

app.use('/products' , productRoute);
app.use('/orders' ,orderRoute);

//the routes name we are already defining along with router imported from productRoute or orderRoute etc 


//this is we are using if we are not putting any valid route or command it will show us error 
app.use((req , res , next ) => {
    const error = new Error('Not Found'); // built in object Error where we can assign error message 
    error.status=404; //we can assign status also
    next(error); //this will forward us to request but will show us the mainly error not actual response 

})


//this is used when first parameter is error it will return default status i.e 404 of previous or 500 and returns error message of above set message 
app.use((error ,req ,res ,next) => {
    res.status(error.status || 500 )
    res.json({
        error:{
            message:error.message
        }
    })
})

module.exports=app;