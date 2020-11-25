var express = require("express");
var router = express.Router();
var path = require("path");

var db = require("../database");

router.get("/pg", (req, res) => {

  db.query('SELECT NOW() as now', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(JSON.stringify(results));
    }
  });

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
