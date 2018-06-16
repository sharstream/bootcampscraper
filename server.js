const request = require('request-promise');
const cheerio = require('cheerio');
const Table = require('cli-table');
const express = require('express');
const logger = require("morgan");
const bodyParser = require("body-parser");

// Require all models
var db = require("./models/Leader");
var PORT = process.env.PORT || 3000;
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
//set jade engine template
app.set('view engine', 'pug')
var mongoose = require("mongoose");
// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/week18Populater");
// Connect routes api
require('./routes/api-leader-routes')(app);

let users = [];
let table = new Table({
    head: ['username', '💙', 'challengers'],
    colWidths: [15, 5, 10]
})

const options = {
    url: `https://forum.freecodecamp.org/directory_items?period=weekly&order=likes_received&_=1528681107140`,
    json: true
}

    app.get('/scraper', (req, res) => {
        request(options)
        .then(data => {
            let user_data = [];
            for (let user of data.directory_items) {
                user_data.push({
                    name: user.user.username,
                    likes_received: user.likes_received
                });
            }

            process.stdout.write('loading');
            getArticles(user_data);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/leaders', (req, res) => {
    console.log('users: ' + users);
    res.render("bootcamp", {
        leaders: users
    });
});

function getArticles(list){
    var i = 0;
    function next(){
        if (i < list.length) {
            var options = {
                url: `https://forum.freecodecamp.org/u/` + list[i].name,
                transform: body => cheerio.load(body)
            }

            request(options)
                .then( function($) {
                    process.stdout.write(`.`);
                    const fccAcc = $('h1.landing-heading').lenght == 0;
                    const challengers = fccAcc ? $('tbody tr').length : 'unknwon';
                    user = {
                        username: list[i].name,
                        likes_received: list[i].likes_received,
                        challengers: list[i].challengers,
                        created_at: Date.now()
                    }
                    users.push(user);
                    table.push([list[i].name, list[i].likes_received, challengers]);
                    // db.Leader.create(list[i])
                    //     .then(function (dbLeader) {
                    //         console.log(dbLeader);
                    //     })
                    //     .catch(function (err) {
                    //         return res.json(err);
                    //     })
                    ++i;
                    return next();
                })
        } else {
            printData();
        }
    }
    return next();
}

function printData( ) {
    console.log("☑️");
    console.log(table.toString());
}

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});