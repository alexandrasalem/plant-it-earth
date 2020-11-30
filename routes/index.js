var express = require("express");
var router = express.Router();
var db = require("../database");

router.get("/pg", (req, res) => {
  db.query(
    "select * from usda_zones where zipcode = 80210;",
    (err, results) => {
      if (err) {
        // console.error(err);
        res.status(500).send(err);
      } else {
        res.send(JSON.stringify(results));
      }
    }
  );
});

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/test", (req, res) => {
  res.status(200);
  res.write("this is working this is WOOOOOOOORKIIIIIIIIIINGG");
  res.send();
});

module.exports = router;
