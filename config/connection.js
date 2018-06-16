// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
module.exports = function(mongoose){
    var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/bootcamp";

    // Set mongoose to leverage built in JavaScript ES6 Promises
    // Connect to the Mongo DB
    mongoose.Promise = Promise;
    mongoose.connect(MONGODB_URI);
}
