const express = require("express");
const router = express.Router();
const Item = require('../models/item');
const User = require('../models/user');
router.post('/search', async function(req, res, next) {
    //console.log(req.body.following);
    //If the search request is sent from the front-end, it will arrived with modified time. 
    //Then check to see if any value is null, if it's set to default. 
    const unixTime = req.body.timestamp || parseInt((new Date().getTime() / 1000).toFixed(0));
    const limit = req.body.limit || 25;
    let followingCheck = req.body.following == undefined ? true : req.body.following;
    if(!req.user){
        followingCheck = false;
    }
    const rank = req.body.rank ||"interest";
    let parent = req.body.parent || "";
    let replies = req.body.replies == undefined ? true : req.body.replies;
    if(!replies) parent = "";
    let media = req.body.hasMedia == undefined ? false : req.body.hasMedia;
    const username = req.body.username || "";
    const searchString = req.body.q || "";
    //Check constraint.
    if(limit > 100){
        limit = 100;
    }
    if(unixTime<=0){
        return res.json({
            status: "error",
            error: "Invalid unix time"
        });
    }
    let result = [];
    let query = [{timestamp:{$lte: unixTime}}];
    searchString && query.push({$text: { $search: searchString}});
    username && query.push({username:{$eq: username}});
    followingCheck && query.push({username:{$in: req.user.following}});
    media && query.push({media:{$ne: []}});
    (!replies) && query.push({childType:{$ne: "reply"}});
    parent && query.push({id:{$eq: parent}});
    let list = {$and:query};
    let sort = {retweeted:-1, likedBy:-1};
    if(rank == "time") sort = {timestamp:-1}
    result = await Item.find(list).sort(sort).limit(limit);
    

    //Need to filter for user's own tweet.
    return res.json({
        status: "OK",
        items: result
    });
});

module.exports = router;