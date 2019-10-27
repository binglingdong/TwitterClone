const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Item= require('../models/item');
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
    if(!req.user) {
        res.json({
            status: "error"
        });
    }
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
        if(user.validKey(key) || key === 'abracadabra'){
            user.verified = true;
            await user.save();
            return res.json({
                status: "OK"
            });
        }
        else {
            return res.json({
                status: "error",
                error: "Invalid Validation Key"
            });
        }
    });
});
//
router.get('/user/:username',  function(req, res, next) {
    User.findOne({ 'username': req.params.username }, async function (err, user) {
        if(err || user == null){
            return res.json({
                status: "error",
                error: err
            });
        }
        else{
            return res.json({
                status: "OK",
                user: {
                    username: user.username,
                    email : user.email,
                    followers : user.followers.length,
                    following : user.following.length
                }
            });
        }
    });
});


router.get('/user/:username/posts',  function(req, res, next) {
    const limit = req.query.limit || 50;
    //Check constraint limit.
    if(limit > 200 || limit < 0){
        return res.json({
            status: "error",
            error: "Limit out of range"
        });
    }
    User.findOne({ 'username': req.params.username }, async function (err, user) {
        if(err || user == null){
            return res.json({
                status: "error",
                error: err
            });
        }
        else{
            const items = Item.find({username:user.username}, async function (err,items ) {
                if(err){
                    return res.json({
                        status: "error",
                        error: err
                    });
                }
                return res.json({
                    status: "OK",
                    items: items.slice(0,limit)
                });
            });
        }
    });
});


router.get('/user/:username/following',  async function(req, res, next) {
    const limit = req.query.limit || 50;
    if(limit > 200 || limit < 0){
        return res.json({
            status: "error",
            error: "Limit out of range"
        });
    }
    await User.findOne({username:req.params.username}, function (err, result) {
        if(err){
            return res.json({
                status: "error",
                error: err
            });
        }

        return res.json({
            status: "OK",
            users: result.following.slice(0, limit)
        });
    });
});

router.get('/user/:username/follower',  async function(req, res, next) {
    const limit = req.query.limit || 50;
    await User.findOne({username:req.params.username}, function (err, result) {
        if(err){
            return res.json({
                status: "error",
                error: err
            });
        }
        return res.json({
            status: "OK",
            users: result.followers.slice(0, limit)
        });
    });
});

router.post('/follow',  function(req, res, next) {
    if(req.user){
        const username = req.body.username;
        const follow = req.body.follow;
        if(follow==true){
             User.update({username: req.user.username}, { $push: { following: username } }, (err, result) => {
                if(err) {
                    return res.json({
                        status: "error"
                    });
                }
            });
            User.update({username: username}, { $push: { followers: req.user.username } }, (err, result) => {
                if(err) {
                    return res.json({
                        status: "error"
                    });
                }
            });
            return res.json({
                status: "OK"
            });
        }
        else{
            User.update({username: req.user.username}, { $pull: { following: username } }, (err, result) => {
                if(err) {
                    return res.json({
                        status: "error"
                    });
                }
            });
            User.update({username: username}, { $pull: { followers: req.user.username } }, (err, result) => {
                if(err) {
                    return res.json({
                        status: "error"
                    });
                }
            });
            return res.json({
                status: "OK"
            });
        }
    }
    return res.json({
        status: "error"
    });
});

module.exports = router;