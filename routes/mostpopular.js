var express = require("express");
var router = express.Router();
const queries = require("../controllers/mostpopular");

router.get("/", async (req, res) => {
  var popularPlants = await queries.getPopularPlants();
  var popularUsers = await queries.getPopularUsers();
  res.render("mostpopular", {
    results1: popularPlants,
    results2: popularUsers,
  });
});

module.exports = router;
