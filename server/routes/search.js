const express = require("express");
const router = express.Router();
const Item = require('../models/item');


router.post('/search', async function(req, res, next) {
    //If the search request is sent from the front-end, it will arrived with modified time. 
    //Then check to see if any value is null, if it's set to default. 
    const unixTime = req.body.timestamp || parseInt((new Date().getTime() / 1000).toFixed(0));
    const limit = req.body.limit || 25;
    
    //
    //Check constraint.
    if(limit > 100 || limit <= 0){
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
        return res.json({
            status: "OK",
            items: result
        });
    }).limit(limit);
});


module.exports = router;