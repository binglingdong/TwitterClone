const express = require("express");
const router = express.Router();
const Item = require('../models/item');
const uuidv1 = require('uuid/v1');

//add item to db
router.post('/additem', async function(req, res, next) {
    //deal error cases??
    if(req.user.username==null){
        return res.json({
            status: "error",
            error: "Need to login..."
        });
    } 
    if(req.body.content==null ){
        return res.json({
            status: "error",
            error: "Empty content is not allowed"
        });
    }
    const id = uuidv1();
    const currentUnixTime = + new Date();
    console.log(currentUnixTime);
    const newitem = new Item({
        id: id,
        username: req.user.username,
        content: req.body.content,
        childType: req.body.childType,
        retweeted: 0,
        property: { likes:0 },
        timestamp: currentUnixTime
    });
    await newitem.save();
    const item = await Item.findOne({ id:id });
    console.log(item);
    return res.json({
        status: "OK",
        id : id
    });
});

router.post('/search', async function(req, res, next) {
    console.log(req.body.timestamp);
    if(req.body.limit == undefined){
        limit = 25;
    }else{
        limit = req.body.limit;
    }
});

module.exports = router;