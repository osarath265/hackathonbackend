const express = require('express')

const router = express.Router();


const mongoose = require('mongoose');


const authdata = require('../models/user');


mongoose.connect('mongodb://localhost:27017/flipyr')


//mailing user 
var nodemailer = require('nodemailer');

var ver_email ;
var ver_id ;

router.post('/signup',(req,res,next)=>
{
    console.log("handling post requests");
    const user = new authdata(
        {
            _id:new mongoose.Types.ObjectId,
            email:req.body.email,
            username:req.body.username,
            password:req.body.password,
            checksum:Math.random()
        }
    )
    //  ver_email = user.email;
    //  ver_id = user._id;
    //  console.log("temporary variables are",ver_email,ver_id);

   
   user
   .save()
   .then(result=>
    {
        console.log("result is saved",result)
        return res.status(201).json({message:"user created"})
    })
   .catch(err=>
    {
        console.log(err);
        return res.status(500).json({error:err});
    });


    //mail sending
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'osarath265@gmail.com',
            pass: 'Cherry@sarath'
        }
    });

    var mailOptions = {
        from: 'osarath265@gmail.com',
        to:req.body.email,
        subject: 'Flypr Verification',
        html: 'Hello    ' + user.username + ' please confirm your mail<a href="http://localhost:3000/auth/verifyemail/?id=' + user.checksum + '&&email=' + user.email + '"> click</a><br>'

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
   
})

router.get('/verifyemail',(req,res,next)=>
{
//first get request is sent using a random id and random id is stored and verified 
    tmp_id = req.query['id'];
    tmp_email = req.query['email'];
    
        authdata.findOne({ email: tmp_email })
            .then(result => {
                console.log("found results are ",result);
                console.log(result.checksum,tmp_id);
                if(result.checksum == tmp_id)
                {
                    authdata.updateOne({email:tmp_email},{$set:{verified:true}},()=>{});
                    return res.status(200).sendFile('C:/Users/sarath/Desktop/flpyrbackend/verified.html');
                }
                else{
                    return res.status(404).json({message:"error is ambiguos"})
                }
            })
            .catch(err => { error: err });     

    
})

router.post('/login',(req,res,next)=>
{
   authdata.findOne({email:req.body.email})
   .then(result=>
    {
        if(result.length<1)
        {
            return res.status(404).json({message:"There is no account with these email,please signup"})
        }
        else if(result.password == req.body.password)
        {
            return res.status(200).json({email:req.body.email});
        }
        else{
            return res.status(404).json({message:"invalid password"});
        }

    })
    .catch(err=>{res.status(404).json({message:"There is no account with these email,please signup"})})
});

router.post('/forgotpasswordlink',(req,res,next)=>
{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'osarath265@gmail.com',
            pass: 'Cherry@sarath'
        }
    });

    var mailOptions = {
        from: 'osarath265@gmail.com',
        to: req.body.email,
        subject: 'Sending Email using Node.js',
        html: 'reset your password <a href=http://localhost:4200/resetpassword;email='+req.body.email+'>click</a>'

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({email:req.body.email});
        }
    });
})

router.post('/resetpassword',(req,res,next)=>
{
    authdata.findOneAndUpdate({email:req.body.email},{$set:{password:req.body.password}}).exec()
    .then(result=>
        {
            console.log(result);
            return res.status(200).json({message:"password updated succesfully"});
        })
    .catch(err=>{
        return res.status(404).json({ error: err});
    })    
})


module.exports=router;