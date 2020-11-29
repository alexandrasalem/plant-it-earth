const express = require("express");
const router = express.Router();
const { token } = require("../credentials.js");
const queries = require("../controllers/search");

router.get("/", (req, res) => {
  res.render("search");
});

router.get("/:veg/:page_num", async (req, res) => {
  let search_veg = req.url.split("/")[1];
  let page_num = req.url.split("/")[2];
  let results = await queries.searchOne(search_veg, page_num);
  console.log(results);
  if ((results.length === 0) & (page_num === "1")) {
    res.render("search", {
      noResults: "yes",
      term: search_veg,
    });
  } else if (results.length === 0) {
    res.render("search", {
      noResultsNow: "yes",
      term: search_veg,
    });
  } else if (page_num == 1) {
    res.render("search", {
      results: results,
      term: search_veg,
    });
  } else {
    res.render("search", {
      results: results,
      term: search_veg,
      notOne: "yes",
    });
  }
});

module.exports = router;
