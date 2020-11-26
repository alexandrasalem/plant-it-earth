const express = require("express");
const router = express.Router();
const { token } = require("../credentials.js");
const queries = require("../controllers/search");

router.get("/", (req, res) => {
  res.render("search");
});

router.post("/", async (req, res) => {
  console.log(req.body);
  if (req.body.continue != undefined) {
    console.log(req.body.continue);
    let fullResults = await queries.searchAll(req);
    res.render("search", { fullResults: `${fullResults}` });
  } else {
    let results = await queries.searchOne(req);
    res.render("search", {
      results: `${results}`,
    });
  }
});

module.exports = router;
