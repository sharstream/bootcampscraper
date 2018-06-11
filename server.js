const request = require('request-promise');
const cheerio = require('cheerio');
const Table = require('cli-table');
const express = require('express');

var app = express();

let users = [];
let table = new Table({
    head: ['username', '💙', 'challengers'],
    colWidths: [15, 5, 10]
})

const options = {
    url: `https://forum.freecodecamp.org/directory_items?period=weekly&order=likes_received&_=1528681107140`,
    json: true
}

request(options)
    .then( data => {
        let user_data = [];
        for(let user of data.directory_items){
            user_data.push({name: user.user.username, likes_received: user.likes_received});
        }

        process.stdout.write('loading');
        getArticles(user_data);
    })
    .catch(err => {
        console.log(err);
    });

function getArticles(user_data){
    var i = 0;
    function next(){
        if (i < user_data.length) {
            var options = {
                url: `https://forum.freecodecamp.org/u/` + user_data[i].name,
                transform: body => cheerio.load(body)
            }

            request(options)
                .then( function($) {
                    process.stdout.write(`.`);
                    const fccAcc = $('h1.landing-heading').lenght == 0;
                    const challengers = fccAcc ? $('tbody tr').length : 'unknwon';
                    table.push([user_data[i].name, user_data[i].likes_received, challengers]);
                    ++i;
                    return next();
                })
        } else {
            printData();
        }
    }
    return next();
}

function printData() {
    console.log("☑️");
    console.log(table.toString());
}

require('./routes/api-articles-routes')(app);