var mongojs = require("mongojs");

module.exports = function(app) {
    // Database configuration
    // Save the URL of our database as well as the name of our collection
    var databaseUrl = "cnn";
    var collections = ["articles"];

    // Use mongojs to hook the database to the db variable
    var db = mongojs(databaseUrl, collections);

    // This makes sure that any errors are logged if mongodb runs into an issue
    db.on("error", function (error) {
        console.log("Database Error:", error);
    });

    // Routes
    // 1. At the root path, send a simple hello cnn message to the browser
    app.get("/", function (req, res) {
        res.send("Hello CNN");
    });

    // 2. At the "/all" path, display every entry in the article collection
    app.get("/all", function (req, res) {
        // Query: In our database, go to the article collection, then "find" everything
        db.articles.find({}, function (err, found) {
            // Log any errors if the server encounters one
            if (err) {
                console.log(err);
            }
            // Otherwise, send the result of this query to the browser
            else {
                res.json(found);
            }
        });
    });

    // 3. At the "/name" path, display every entry in the animals collection, sorted by name
    app.get("/name", function (req, res) {
        // Query: In our database, go to the animals collection, then "find" everything,
        // but this time, sort it by name (1 means ascending order)
        db.articles.find().sort({
            name: 1
        }, function (err, found) {
            // Log any errors if the server encounters one
            if (err) {
                console.log(err);
            }
            // Otherwise, send the result of this query to the browser
            else {
                res.json(found);
            }
        });
    });
}