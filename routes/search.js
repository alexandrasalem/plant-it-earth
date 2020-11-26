const express = require("express");
const router = express.Router();
const { token } = require("../credentials.js");
const queries = require("../controllers/search");

router.get("/", (req, res) => {
  res.render("search");
});

router.post("/", async (req, res) => {
  let common_names = await queries.searchAll(req);
  res.render("search", {
    results: `${common_names}`,
  });
});

module.exports = router;
