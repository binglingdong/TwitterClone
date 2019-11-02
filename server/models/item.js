const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    id: {
        type: String,
        require: true,
        unique: true
    },
    username: String,
    content: String, 
    childType: String,
    retweeted: Number,
    property:{
        likes: Number,
    },
    timestamp: Number,
});
let model = mongoose.model('Item', itemSchema);


   
module.exports = model;