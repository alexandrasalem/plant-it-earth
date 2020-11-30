var express = require("express");
var router = express.Router();
const queries = require("../controllers/mostpopular");

// Pulls most popular plants.
// Has some functionality to pull most popular users, but didn't have time to complete.
router.get("/", async (req, res) => {
  try {
    var popularPlants = await queries.getPopularPlants();
    // var popularUsers = await queries.getPopularUsers();
    res.render("mostpopular", {
      results1: popularPlants,
      // results2: popularUsers,
    });
  } catch (error) {
    console.log(error);
    res.render("error", { message: "Something went wrong." });
  }
});

module.exports = router;
