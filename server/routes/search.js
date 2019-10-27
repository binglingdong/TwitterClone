const express = require("express");
const router = express.Router();
const Item = require('../models/item');
const User = require('../models/user');

router.post('/search', async function(req, res, next) {
    //If the search request is sent from the front-end, it will arrived with modified time. 
    //Then check to see if any value is null, if it's set to default. 
    const unixTime = req.body.timestamp || parseInt((new Date().getTime() / 1000).toFixed(0));
    const limit = req.body.limit || 25;
    let followingCheck = req.body.following == undefined ? true : req.body.following;
    if(!req.user){
        followingCheck = false;
    }
    const username = req.body.username || "";
    const searchString = req.body.q || "";
    //Check constraint.
    if(limit > 100 || limit <= 0){
        res.json({
            status: "error",
            error: "Limit out of range"
        });
    }
    if(unixTime<=0){
        res.json({
            status: "error",
            error: "Invalid unix time"
        });
    }
    const searchReg = ".*"+searchString.replace(" ", "|") +".*";
    console.log(searchReg);
    const nameReg = ".*"+username+".*";
    let result = [];
    if(username==="" && searchString === ""){
        result = await Item.find({timestamp:{$lte: unixTime}});
    }else if(username === ""){
        result = await Item.find( {$and: [{content: {$regex: searchReg, $options: 'i'}}, {timestamp:{$lte: unixTime}}]});
    }else if(searchString === ""){
        result = await Item.find( {$and:[{username: {$regex: nameReg, $options: 'i' }}, {timestamp:{$lte: unixTime}}]});
    }
    else{
        result = await Item.find( {$and: [{username: {$regex: nameReg, $options: 'i' }},{content: {$regex: searchReg, $options : 'i'}},{timestamp:{$lte: unixTime}}]});    
    }
    //NOW result contains all the items that match the username and q. 
    //NEXT need to filter the following.
    if(followingCheck){
        const user = await User.findOne({username:req.user.username});
        const followings = user.following;
        result = result.filter(item => followings.includes(item.username));
    }
    res.json({
        status: "OK",
        items: result.slice(-limit).reverse()
    });
});

module.exports = router;