const fetch = require("node-fetch");
const { token } = require("../credentials.js");

var url = `https://trefle.io/api/v1/plants/search?token=${token}`;

async function searchOne(search_veg, page_num) {
  url = `${url}&page=${page_num}&q=${search_veg}`;
  console.log(url);
  var data = await fetch(url);
  var data = await data.json();
  let search_results = [];
  if (data !== undefined) {
    for (let index = 0; index < data.data.length; index++) {
      if (
        data.data[index].common_name != null &&
        data.data[index].common_name
          .toLowerCase()
          .includes(search_veg.toLowerCase().replace("%20", " "))
      ) {
        search_results.push([
          data.data[index].common_name,
          data.data[index].image_url,
          data.data[index].id,
        ]);
      }
    }
  }
  return search_results;
}

exports.searchOne = searchOne;
