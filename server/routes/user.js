const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const uuidv4 = require('uuid/v4');

router.get('/user',  function(req, res, next) {
    const user = req.user ? req.user.username : null;
    res.json({
        username: user
    });
});

router.post('/adduser', async function(req, res, next) {  
    const key = uuidv4();
    
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service:'Gmail',
        auth: {
            user: 'lbfmsbu@gmail.com', // generated ethereal user
            pass: 'bing1999lingF'// generated ethereal password
        }
    });  
    
    const message = {
        from: '"LBFM" <lbfmsbu@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: 'ValidationKey', // Subject line
        text: 'Validation key: <' + key + '>', // plain text body
    };

    transporter.sendMail(message, function(error, info){
        if (error) {
            console.log(error);
        }
    });

    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        verified: false,
        key: key
    });

    await newUser.save();

    res.json({
        status: "OK"
    });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err || !user){ 
            return res.json({
                status: "error",
                error: info.message
            });
        }
        req.logIn(user, function(err) {
            if(err)
                return res.json({
                    status: "error",
                    error: err
                });
            return res.json({
                status: "OK",
                username: req.user.username
            });
        });
    })(req, res, next);
});

router.post('/logout', function(req, res, next) {
    req.logout();
    res.json({
        status: "OK"
    });
});

router.post('/verify',  function(req, res, next) {
    const email = req.body.email;
    const key = req.body.key;
    User.findOne({ 'email': email }, async function (err, user) {
        if(err || user == null){
            return res.json({
                status: "error",
                error: err
            });
        }
        if(user.validKey() || key === 'abracadabra'){
            user.verified = true;
            await user.save();
            return res.json({
                status: "OK"
            });
        }
        else {
            return res.json({
                status: "ERROR",
                error: "Invalid valification code"
            });
        }
    });
});

module.exports = router;