const fetch = require("node-fetch");
const { token } = require("../credentials.js");

var url = `https://trefle.io/api/v1/plants/search?token=${token}`;

async function searchOne(search_veg) {
  url = `${url}&q=${search_veg}`;
  var data = await fetch(url);
  var data = await data.json();
  let search_results = [];
  for (let index = 0; index < data.data.length; index++) {
    if (
      data.data[index].common_name != null &&
      data.data[index].common_name
        .toLowerCase()
        .includes(search_veg.toLowerCase())
    ) {
      search_results.push([
        data.data[index].common_name,
        data.data[index].image_url,
        data.data[index].id,
      ]);
    }
  }
  return search_results;
}

async function searchAll(search_veg) {
  url = `${url}&q=${search_veg}`;
  var data = await fetch(url);
  var data = await data.json();
  var allData = data;
  var next = data.links.next;
  while (next != undefined) {
    var newData = await fetch(`https://trefle.io${next}&token=${token}`);
    var newData = await newData.json();
    next = newData.links.next;
    allData.data = allData.data.concat(newData.data);
    allData.links = newData.links;
    allData.meta = newData.meta;
    console.log(next);
  }

  search_results = [];
  for (let index = 0; index < allData.data.length; index++) {
    if (
      allData.data[index].common_name != null &&
      allData.data[index].common_name
        .toLowerCase()
        .includes(search_veg.toLowerCase())
    ) {
      search_results.push([
        data.data[index].common_name,
        data.data[index].image_url,
        data.data[index].id,
      ]);
    }
  }

  return search_results;
}

exports.searchAll = searchAll;
exports.searchOne = searchOne;
