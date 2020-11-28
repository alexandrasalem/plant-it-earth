const { response } = require("express");
var db = require("../database");
const fetch = require("node-fetch");
const ourToken = require("../credentials.js");

async function getTrefleImg(id) {
  var url = `https://trefle.io/api/v1/plants/${id}?token=${ourToken.token}`;
  let res = await fetch(url);
  let data = await res.json();
  if (data.error) {
    return data.error;
  } else {
    return data.data.image_url;
  }
}

let plants_query = `
    SELECT p.name, p.plant_id, count(*) as count
    FROM users u1
    JOIN questions q
    ON q.user_id=u1.user_id
    LEFT JOIN responses r
    ON r.question_id= q.question_id
    LEFT JOIN users u2
    ON r.user_id = u2.user_id
    JOIN plants p
    ON p.plant_id = q.plant_id
    GROUP BY p.plant_id
    ORDER BY count DESC
      `;
let users_query = `
    SELECT counts.username, SUM(counts.count) as count
    FROM ((SELECT u1.username, u1.user_id, count(*) as count
    FROM users u1
    JOIN questions q
    ON q.user_id=u1.user_id
    GROUP BY u1.user_id)
    UNION
    (SELECT u1.username, u1.user_id, count(*) as count
    FROM users u1
    JOIN responses r
    ON r.user_id=u1.user_id
    GROUP BY u1.user_id)) as counts
    GROUP BY counts.username
    ORDER BY count DESC
  `;

async function getPopularPlants() {
  try {
    let response = await db.query(plants_query);
    console.log(response.rows);
    let html_results = [];
    for (let i = 0; i < response.rows.length; ++i) {
      image_url = await getTrefleImg(response.rows[i].plant_id);
      html_results.push([
        response.rows[i].name,
        image_url,
        response.rows[i].plant_id,
      ]);
    }
    return html_results;
  } catch (error) {
    console.log(error);
  }
}

async function getPopularUsers() {
  try {
    let response = await db.query(users_query);
    console.log(response.rows);
    let names = [];
    for (let i = 0; i < response.rows.length; ++i) {
      names.push(`${response.rows[i].username} <br>`);
    }
    return names.join(" ");
  } catch (error) {
    console.log(error);
  }
}
exports.getPopularPlants = getPopularPlants;
exports.getPopularUsers = getPopularUsers;
