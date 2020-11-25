var express = require("express");
var router = express.Router();
const queries = require("../controllers/mostpopular");

router.get("/", async (req, res) => {
  var popularPlants = await queries.getPopularPlants();
  res.render("mostpopular", { results: popularPlants });
});

module.exports = router;
