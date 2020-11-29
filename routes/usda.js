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

    db.query('select * from usda_zones where zipcode = ' + req.body.zip + ';', (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {

        //do the second query for the plants we can grow
        db.query("select * from plants_data where min_zone = '" + results.rows[0].zone + "';", (err2, results2) => {
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

module.exports = router;