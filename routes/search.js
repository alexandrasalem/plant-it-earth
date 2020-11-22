const express = require("express");
const router = express.Router();
const path = require("path");
const parser = require("body-parser");
const ourToken = require("../credentials.js");
const port = process.env.PORT || 5000;

router.use(
  parser.urlencoded({
    extended: false,
    limit: 1024,
  })
);

const fetch = require("node-fetch");
var url = `https://trefle.io/api/v1/plants/search?token=${ourToken}`;

async function fetchAll(url) {
  let response = await fetch(url);
  if (response.status == 200) {
    let json = await response.json();
    return json;
  }
  throw new Error(response.status);
}

router.get("/", (req, res) => {
  res.render("search");
});

router.post("/", async (req, res) => {
  console.log("hello");
  url = `${url}&q=${req.body.veg}`;
  var data = await fetchAll(url);
  var allData = data;
  var next = data.links.next;
  while (next != undefined) {
    let newData = await fetchAll(`https://trefle.io${next}&token=${ourToken}`);
    next = newData.links.next;
    allData.data = allData.data.concat(newData.data);
    allData.links = newData.links;
    allData.meta = newData.meta;
    console.log(next);
  }
  common_names = [];
  for (let index = 0; index < allData.data.length; index++) {
    if (
      allData.data[index].common_name != null &&
      allData.data[index].common_name
        .toLowerCase()
        .includes(req.body.veg.toLowerCase())
    ) {
      common_names.push(
        `<article class="media">
        <figure class="media-left">
          <p class="image is-64x64">
            <img src="${allData.data[index].image_url}" alt = "${allData.data[index].common_name}">
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <a href = "/plant/${allData.data[index].id}">${allData.data[index].common_name}</a>
          </div>
        </div>
      </article>`
      );
    }
  }
  res.render("search", {
    results: `${common_names.join("")}`,
  });
});

module.exports = router;
