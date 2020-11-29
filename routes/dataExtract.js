const token= require('../credentials');
const https = require('https');
var db = require("../database");

var last = 2;
var cur = 1;


function getPage() {
    https.get('https://trefle.io/api/v1/plants?token=' + token.token + "&page=" + cur, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        var d = JSON.parse(data);

        console.log(data);

        //loop all the results
        for(p in d.data) {

            //use the results
            console.log("id:" + d.data[p].id);   
            console.log("name:" + d.data[p].common_name);   

            last = d.links.last.split("page=")[1];

            db.query("insert into plants (plant_id, name) values(" + d.data[p].id + ", '" + d.data[p].common_name + "')", (err, results) => {
                if (err) {
                  console.error(err);              
                } else {
                  console.log(results);
                }
            });
        }

        cur++;

        if(cur < last) {
            getPage();
        }
        else {
            console.log("DONE!");
        }
    });

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    });
}

getPage();