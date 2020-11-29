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
  
  console.log(req);

  db.query('select * from usda_zones where zipcode = ' + req.body.zip + ';', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.render("usda", {
        results: `${results.rows[0].zone}`,
      });
    }
  });

  
});

module.exports = router;