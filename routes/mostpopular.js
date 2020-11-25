var express = require("express");
var router = express.Router();
const queries = require("../controllers/mostpopular");

router.get("/", async (req, res) => {
  var popularPlants = await queries.getPopularPlants();
  console.log(popularPlants.rows);
  console.log(typeof popularPlants);
  console.log(popularPlants.json());
  Object.values(popularPlants).forEach((element) => {
    console.log(element);
  });
  res.render("mostpopular");
});

module.exports = router;
