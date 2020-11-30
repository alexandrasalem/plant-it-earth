const https = require('https');
var db = require("../database");


function importToDB() {
    //import values for usda_zones numerical values
    db.query("INSERT INTO usda_zone_ids (usda_zone_name) VALUES ('1a'), ('0a'), ('0b'), ('1a'), ('1b'), ('1a'), ('2a'), ('2b'), ('3a'), ('3b'), ('4a'), ('4b'), ('5a'), ('5b'), ('6a'), ('6b'), ('7a'), ('7b'), ('8a'), ('8b'), ('9a'), ('9b'), ('10a'), ('10b'), ('11a'), ('11b'), ('12a'), ('12b');", (err, results) => {
        if (err) {
          console.error(err);              
        } 
    });
}

importToDB();