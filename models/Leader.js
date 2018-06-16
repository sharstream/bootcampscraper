var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LeaderSchema = new Schema({
    username: {
        type: String,
        required:true
    },
    likes_received: {
        type: Number
    },
    challenegers: {
        type: Number
    },
    date: Date
});

module.exports = mongoose.model('Leader', LeaderSchema);