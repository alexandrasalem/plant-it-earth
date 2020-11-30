const express = require("express");
const router = express.Router();
const path = require("path");
const parser = require("body-parser");
const ourToken = require("../credentials.js");
const port = process.env.PORT || 5000;
var db = require("../database");

router.use(
  parser.urlencoded({
    extended: false,
    limit: 1024,
  })
);

router.get("/", (req, res) => {
  res.render("usda");
});

router.post("/", async (req, res) => {
  
  if(req.body.zip == "") {
    res.render("usda", {
      error: `Zip can not be blank`
    });
  }
  else {

    //query to identify what usda_zone in the provided zipcode
    db.query('select * from usda_zones where zipcode = ' + req.body.zip + ';', (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {

        //identify usda_zone id
        db.query("select id from usda_zone_ids where usda_zone_name = '" + results.rows[0].zone + "';", (err_id, results_id) => {
          if (err_id) {
            console.error(err_id);
            res.status(500).send(err_id);
          } else {
            //do the second query for the plants that can grow in a provided zone (all plants that can grow above its minimum usda_zone)
            db.query("SELECT * FROM plants_data pl JOIN usda_zone_ids z ON z.usda_zone_name = pl.min_zone WHERE z.id >= " + results_id.rows[0].id + ";", (err2, results2) => {
              if (err2) {
                console.error(err2);
                res.status(500).send(err2);
              } else {
                res.render("usda", {
                  results: `${results.rows[0].zone}`,
                  zoneData: results2.rows
                });
              }
            });
          }
        });
      }
    });
  }
});

module.exports = router;