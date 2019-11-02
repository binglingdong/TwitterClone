const express = require("express");
const router = express.Router();
const Item = require('../models/item');
const uuidv1 = require('uuid/v1');

//add item to db
router.post('/additem', async function(req, res, next) {
    //deal error cases
    if(!req.user){
        return res.json({
            status: "error",
            error: "Need to login"
        });
    } 
    if(!req.body.content){
        return res.json({
            status: "error",
            error: "Empty content is not allowed"
        });
    }
    const id = uuidv1();
    const currentUnixTime = parseInt((new Date().getTime() / 1000).toFixed(0));
    const newitem = new Item({
        id: id,
        username: req.user.username,
        content: req.body.content,
        childType: req.body.childType || null,
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

router.get('/item/:id', async function(req, res, next) {
    await Item.findOne({id:req.params.id}, async function (err, result) {
        if(err){
            return res.json({
                status: "error",
                error: err
            });
        }
        return res.json({
            status: "OK",
            item: result
        });
    });
});

router.delete('/item/:id', async function(req, res, next) {
    await Item.deleteOne({id:req.params.id}, async function (err, result) {
        if(err || result.deletedCount === 0){
            res.status(404).end()
        }
        res.status(200).end()
    });
});

module.exports = router;