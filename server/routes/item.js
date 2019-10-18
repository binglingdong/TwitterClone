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
    const currentUnixTime = parseInt((new Date().getTime() / 1000).toFixed(0));
   // console.log(currentUnixTime);
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
    //const item = await Item.findOne({ id:id });
    //console.log(item);
    return res.json({
        status: "OK",
        id : id
    });
});

router.post('/search', async function(req, res, next) {
    //If the search request is sent from the front-end, it will arrived with modified time. 
    //Then check to see if any value is null, if it's set to default. 
    let unixTime = req.body.timestamp;
    let limit = req.body.limit;     
         
    if(limit == undefined || limit.length == 0){ //If no limit provided.
        limit = 25;//Default limit is 25
    }else{  
        limit = parseInt(req.body.limit);   //Else, parse whatever to int.
    }
    if(unixTime == undefined || unixTime.length == 0){ //If no time provided.
        unixTime = parseInt((new Date().getTime() / 1000).toFixed(0)); //Default to rightnow
    }

    //Check constraint.
    if(limit>100 || limit<=0){
        return res.json({
            status: "error",
            error: "Limit out of range"
        });
    }
    if(unixTime<=0){
        return res.json({
            status: "error",
            error: "Invalid unix time"
        });
    }
    
    await Item.find({timestamp:{$lte: unixTime}}, async function (err, result) {
        console.log(result);
        if(err){
            return res.json({
                status: "error",
                error: err
            });
        }
        if(result.length == 0){
            return res.json({
                status: "error",
                error: "No result"
            });
        }
        else{
            return res.json({
                status: "OK",
                items:result
            });
        }
    }).limit(limit);

});

module.exports = router;