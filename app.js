const express=require('express');
const path=require('path');
const app=express();
const morgan=require('morgan');
const mongoose=require('mongoose');
const fs=require('fs');
const AppError=require('./apperror');
app.use(express.static(path.join(__dirname,'static')));
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
mongoose.connect('mongodb://127.0.0.1:27017/authentication',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
const Schema=mongoose.Schema;
mongoose.connection.on('error',console.error.bind(console,'ConnectionError'));
mongoose.connection.once('open',()=>{
    console.log("DATABASE CONNECTED");
})
const authentication=new Schema({
    user:{
        type:String,
        required:true
    },
    pass:{
        type:String,
        required:true
    }
});
const Authentication=mongoose.model('Authentication',authentication);
app.use(morgan('dev'));
app.get('/auth',(req,res)=>{
    res.status(200).render('auth.ejs');
});
function wrapasync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(e=>next(e));
    }
}
const authenticationCheck=wrapasync(async(req,res,next)=>{
    const {user,pass}=req.query;
    const data=await Authentication.find({user:user});
    if(!(data.length===0)&&(data[0].pass)===pass){
        next();
    }
    else
    {
        throw new AppError(400,'Password Required');
        res.send("you must provide password");
    }
});
app.get('/error',(req,res)=>{
    throw new AppError(400,"NO Password");
    chicken.fly()
})
app.post('/auth',wrapasync(async(req,res,next)=>{
    // console.log(req.body);
        // throw new AppError(405,"BHODSIKE")
        const {user,pass}=req.body;
        const auth=new Authentication({user:user,pass:pass})
        await auth.save();
    // console.log(auth);
}))
app.get('/',authenticationCheck,wrapasync(async(req,res,next)=>{
    next(new Error('HI'));
    res.send("HI");
}))
app.post('/',wrapasync(async(req,res)=>{
    res.send("HIhgjhgv");
}))
app.get('/admin',(req,res)=>{
    throw new AppError(403,'You are not a admin')
})
app.use((req,res,next)=>{
    res.status(200).send("No Page Found")
})
app.use((err,req,res,next)=>{
    console.log("********ERROR********");
    console.log("********ERROR********");
    console.log("********ERROR********");
    const {status=400,message='CHICKEN'}=err;
    res.status(status).send(message);
    console.log(err)
})
app.listen(3000,()=>{
    console.log('Server Started');
})
