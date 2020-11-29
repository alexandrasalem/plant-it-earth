var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  try {
    res.render("gettingstarted");
  } catch (error) {
    res.render("error", { message: "Something went wrong." });
  }
});

module.exports = router;
