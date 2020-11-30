const express = require("express");
const router = express.Router();
const queries = require("../controllers/search");

// Initial search page
router.get("/", (req, res) => {
  res.render("search");
});

// Search page after first search
router.get("/:veg/:page_num", async (req, res) => {
  try {
    let search_veg = req.url.split("/")[1];
    let page_num = req.url.split("/")[2];
    let results = await queries.searchOne(search_veg, page_num);
    if ((results.length === 0) & (page_num === "1")) {
      res.render("search", {
        noResults: "yes",
        term: search_veg.replace("%20", " "),
      });
    } else if (results.length === 0) {
      res.render("search", {
        noResultsNow: "yes",
        term: search_veg.replace("%20", " "),
      });
    } else if (page_num == 1) {
      res.render("search", {
        results: results,
        term: search_veg.replace("%20", " "),
      });
    } else {
      res.render("search", {
        results: results,
        term: search_veg.replace("%20", " "),
        notOne: "yes",
      });
    }
  } catch (error) {
    res.render("error", { message: "Something went wrong." });
  }
});

module.exports = router;
