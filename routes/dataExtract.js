// const token= require('../credentials');
const token= process.env.TREFLE_TOKEN 
const https = require('https');
var db = require("../database");
const { isNull } = require('util');

var last = 2;
var cur = 1;

function get_usda_zone(min_temp_f){

    if (min_temp_f == null) {
        zone = null
        return zone
    }

    else if(min_temp_f < -65) {
        zone = "'0a'";
    }
    else if(min_temp_f >= -65 && min_temp_f < -60) 
    {
        zone = "'0b'"
    }
    else if(min_temp_f >= -60 && min_temp_f < -55) {
        zone = "'1a'";
    }
    else if(min_temp_f >= -55 && min_temp_f < -50) {
        zone = "'1b'";
    }
    else if(min_temp_f >= -50 && min_temp_f < -45) {
        zone = "'2a'";
    }
    else if(min_temp_f >= -45 && min_temp_f < -40) {
        zone = "'2b'";
    }
    else if(min_temp_f >= -40 && min_temp_f < -35) {
        zone = "'3a'";
    }
    else if(min_temp_f >= -35 && min_temp_f < -30) {
        zone = "'3b'";
    }
    else if(min_temp_f >= -30 && min_temp_f < -25) {
        zone = "'4a'";
    }
    else if(min_temp_f >= -25 && min_temp_f < -20) {
        zone = "'4b'";
    }
    else if(min_temp_f >= -20 && min_temp_f < -15) {
        zone = "'5a'";
    }
    else if(min_temp_f >= -15 && min_temp_f < -10) {
        zone = "'5b'";
    }
    else if(min_temp_f >= -10 && min_temp_f < -5) {
        zone = "'6a'";
    }
    else if(min_temp_f >= -5 && min_temp_f < 0) {
        zone = "'6b'";
    }
    else if(min_temp_f >= 0 && min_temp_f < 5) {
        zone = "'7a'";
    }
    else if(min_temp_f >= 5 && min_temp_f < 10) {
        zone = "'7b'";
    }
    else if(min_temp_f >=10 && min_temp_f < 15) {
        zone = "'8a'";
    }
    else if(min_temp_f >= 15 && min_temp_f < 20) {
        zone = "'8b'";
    }
    else if(min_temp_f >= 20 && min_temp_f < 25) {
        zone = "'9a'";
    }
    else if(min_temp_f >= 25 && min_temp_f < 30) {
        zone = "'9b'";
    }
    else if(min_temp_f >= 30 && min_temp_f < 35) {
        zone = "'10a'";
    }
    else if(min_temp_f >= 35 && min_temp_f < 40) {
        zone = "'10b'";
    }
    else if(min_temp_f >= 40 && min_temp_f < 45) {
        zone = "'11a'";
    }
    else if(min_temp_f >= 45 && min_temp_f < 50) {
        zone = "'12a'";
    }
    else if(min_temp_f >= 55) {
        zone = "'12b'";
    }
    return zone; 
}

function getData(id) {
    https.get('https://trefle.io/api/v1/plants/' + id + '?token=' + token, (resp) => {
        let data = '';
    
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
    
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            var d = JSON.parse(data);

            //console.log(d);
    
            //disregard records that do not have plant name
            if(d.data.common_name != null) {

                //use the results
               
               var temp_min = null;
               var temp_max = null;
               var veg_status = null;
               var edible_status = null;
               var edible_part = null;
               var days_to_harvest = null;
               if (d.data.main_species.growth.minimum_temperature.deg_f)
               {
                   temp_min = d.data.main_species.growth.minimum_temperature.deg_f;
               }
               var zone = get_usda_zone(d.data.main_species.growth.minimum_temperature.deg_f);

               if (d.data.main_species.growth.maximum_temperature.deg_f)
               {
                   temp_max = d.data.main_species.growth.maximum_temperature.deg_f;
               }
               //replace ' with \'
               var common = d.data.common_name.replace(/'/g, "''");
               
               //replace ' with \'
               var sci = d.data.scientific_name.replace(/'/g, "''");
               
               //obtain values from response and replace its default null value
               if (d.data.vegetable)
               {
                   veg_status = d.data.vegetable;
               }
               
               if (d.data.main_species.edible)
               {
                   edible_status = "'" + d.data.main_species.edible + "'";
               }

               if (d.data.main_species.edible_part)
               {
                   edible_part = "'" + d.data.main_species.edible_part + "'";
               }

               if (d.data.main_species.growth.days_to_harvest)
               {
                   days_to_harvest = "'" + d.data.main_species.growth.days_to_harvest + "'";
               }

               console.log ("insert into plants_data (plant_id, common_name, scientific_name, vegetable, edible, edible_part, min_temp_f, max_temp_f, days_to_harvest, min_zone ) values(" + d.data.main_species_id + ", '" + common + "', '" + sci + "', " + veg_status + ",  " + edible_status + ", " + edible_part + ", " + temp_min + ", " + temp_max + ", " + days_to_harvest + ", " + zone +")");
               //insert values into query and execute
               db.query("insert into plants_data (plant_id, common_name, scientific_name, vegetable, edible, edible_part, min_temp_f, max_temp_f, days_to_harvest, min_zone ) values(" + d.data.main_species_id + ", '" + common + "', '" + sci + "', " + veg_status + ",  " + edible_status + ", " + edible_part + ", " + temp_min + ", " + temp_max + ", " + days_to_harvest + ", " + zone +")", (err, results) => {
                   if (err) {
                   console.error(err);              
                   } 
               });
           }
        });
    
        }).on("error", (err) => {
        console.log("Error: " + err.message);
        });
}

function getPage() {
    https.get('https://trefle.io/api/v1/plants?token=' + token + "&page=" + cur, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        var d = JSON.parse(data);

        //loop all the results
        for(p in d.data) {

            //start with the first page
            last = d.links.last.split("page=")[1];
        
            getData(d.data[p].id);
        }
        //go to the next page
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