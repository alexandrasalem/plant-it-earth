const fetch = require("node-fetch");
const { token } = require("../credentials.js");

var url = `https://trefle.io/api/v1/plants/search?token=${token}`;

async function searchAll(request) {
  url = `${url}&q=${request.body.veg}`;
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
  common_names = [];
  for (let index = 0; index < allData.data.length; index++) {
    if (
      allData.data[index].common_name != null &&
      allData.data[index].common_name
        .toLowerCase()
        .includes(request.body.veg.toLowerCase())
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
  return common_names.join("");
}

exports.searchAll = searchAll;
