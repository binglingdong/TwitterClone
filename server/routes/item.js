const express = require("express");
const router = express.Router();
const Item = require('../models/item');
const uuidv1 = require('uuid/v1');
const multer  = require('multer');
const fs = require('fs')
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, uuidv1() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage })

router.post('/additem', async function(req, res, next) {
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
        parent: req.body.parent,
        retweeted: 0,
        property: { likes:0 },
        timestamp: currentUnixTime,
        media: req.body.media
    });
    await newitem.save();
    return res.json({
        status: "OK",
        id : id
    });
});

router.get('/item/:id', async function(req, res, next) {
    await Item.findOne({id:req.params.id}, async function (err, result) {
        if(err || !result){
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
    if(!req.user)
        return res.status(404).end();
    const item = await Item.findOne({id:req.params.id});
    if(!item || item.username !== req.user.username)
        return res.status(404).end();
    const media = item.media;
    await Item.deleteOne({id:req.params.id}, async function (err, result) {
        if(err || result.deletedCount === 0){
            return res.status(404).end();
        }
        res.status(200).end();
        media.forEach(filepath => {
            filepath = path.join(__dirname, '../uploads/' + filepath);
            fs.unlink(filepath, (err) => {
                if (err) {
                    console.error(err)
                }
            }); 
        });
    });
});

router.post('/addmedia', upload.single('media'), async function(req, res, next) {
    if(!req.user) {
        return res.json({
            status: "error",
            error: "Need to login"
        });
    }

    return res.json({
            status: "OK",
            id: req.file.filename
    });
});

router.get('/media/:id',  async function(req, res, next) {
    const filepath = path.join(__dirname, '../uploads/' + req.params.id);
    try {
        if(!fs.existsSync(filepath)) {
            return res.status(404).end();
        }
    } catch(err) {
        return res.status(404).end();
    }
    return res.status(200).sendFile(filepath);
});

module.exports = router;