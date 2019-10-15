const express = require("express");
const router = express.Router();
const Items = require('../models/item');
const uuidv4 = require('uuid/v4');

//add item to db
router.post('/additem', async function(req, res, next) {
    //deal error cases??
    if(req.body.content==null){
        return res.json({
            status: "error",
            error: "Empty content is not allowed"
        });
    }
    const id = uuidv4();
    const newitem = new Items({
        id: id,
        username: req.body.username,
        content: req.body.content,
        childType: req.body.childType,
        retweeted: 0,
        property: { likes:0 },
        timestamp: new Date()
    });
    await newitem.save();
    const item = await Items.findOne({ id:id });
    console.log(item);
    return res.json({
        status: "OK",
        id : id
    });
});


module.exports = router;