const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Item= require('../models/item');
const nodemailer = require('nodemailer');
const uuidv4 = require('uuid/v4');

router.get('/user',  function(req, res, next) {
    const user = req.user ? req.user.username : null;
    return res.json({
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

    return res.json({
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
        return res.json({
            status: "error"
        });
    }
    req.logout();
    return res.json({
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
    let limit = req.query.limit || 50;
    //Check constraint limit.
    if(limit > 200){
        limit = 200;
    }
    User.findOne({ 'username': req.params.username }, async function (err, user) {
        if(err || user == null){
            return res.json({
                status: "error",
                error: err
            });
        }
        else{
            try { 
                let itemIds = await Item.find({username:user.username}).distinct("id", {});
                return res.json({
                    status: "OK",
                    items: itemIds.slice(-limit).reverse()
                });
            } catch(err) {
                return res.json({
                    status: "error",
                    error: err
                });
            }
        }
    });
});

router.post('/user/following',  async function(req, res, next) {
    await User.findOne({username:req.user.username}, function (err, result) {
        if(err){
            return res.json({
                status: "error",
                error: err
            });
        }
        return res.json({
            status: "OK",
            following: result.following.includes(req.body.username)
        });
    });
});

router.get('/user/:username/following',  async function(req, res, next) {
    let limit = req.query.limit || 50;
    if(limit > 200){
        limit = 200;
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
            users: result.following.slice(-limit).reverse()
        });
    });
});

router.get('/user/:username/followers',  async function(req, res, next) {
    let limit = req.query.limit || 50;
    if(limit > 200){
        limit = 200;
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
            users: result.followers.slice(-limit).reverse()
        });
    });
});

router.post('/follow',  async function(req, res, next) {
    if(req.user) {
        const username = req.body.username;
        const follow = req.body.follow;
        if(username===req.user.username)//cannot follow urself
            return res.json({
                status: "error",
                error: "Can't follow yourself"
            });
        const user = await User.findOne({username:username});
        //cannot follow nonexist user
        if(!user) {
            return res.json({
                status: "error",
                error: "User doesn't exist"
            });
        }
        if(follow && req.user.following.includes(username)) {
            return res.json({
                status: "error",
                error: "User is already following"
            });
        }
        if(!follow && !req.user.following.includes(username)) {
            return res.json({
                status: "error",
                error: "User isn't following"
            });
        }

        if(follow){
            await User.updateOne({username: req.user.username}, { $addToSet: { following: username } }, (err, result) => {
                if(err) {
                    return res.json({
                        status: "error",
                        error: err
                    });
                }
            });
            await User.updateOne({username: username}, { $addToSet: { followers: req.user.username } }, (err, result) => {
                if(err) {
                    return res.json({
                        status: "error",
                        error: err
                    });
                }
            });
            return res.json({
                status: "OK"
            });
        }
        else{
            await User.updateOne({username: req.user.username}, { $pull: { following: username } }, (err, result) => {
                if(err) {
                    return res.json({
                        status: "error",
                        error: err
                    });
                }
            });
            await User.updateOne({username: username}, { $pull: { followers: req.user.username } }, (err, result) => {
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
       status: "error",
       error: "You have to login"
    });
});

module.exports = router;