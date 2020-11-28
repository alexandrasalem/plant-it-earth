const express = require("express");
const router = express.Router();
const { token } = require("../credentials.js");
const queries = require("../controllers/search");

router.get("/", (req, res) => {
  res.render("search");
});

router.get("/:veg", async (req, res) => {
  let search_veg = req.url.split("/")[1];
  let results = await queries.searchOne(search_veg);
  console.log(results);
  res.render("search", {
    results: results,
  });
});

router.get("/:veg/full", async (req, res) => {
  let search_veg = req.url.split("/")[1];
  let fullResults = await queries.searchAll(search_veg);
  res.render("search", {
    fullResults: fullResults,
  });
});

module.exports = router;
