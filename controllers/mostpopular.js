var db = require("../database");
const fetch = require("node-fetch");
// const ourToken = require("../credentials.js");
const token= process.env.TREFLE_TOKEN;

// Get image url for a plant id
async function getTrefleImg(id) {
  var url = `https://trefle.io/api/v1/plants/${id}?token=${ourToken.token}`;
  let res = await fetch(url);
  let data = await res.json();
  return data.data.image_url;
}

// Query for plants ordered by questions/comments
let plants_query = `
  SELECT counts.plant_id, counts.name, count(*) as count
  FROM ((SELECT p.name, p.plant_id
      FROM users u1
      JOIN questions q
      ON q.user_id=u1.user_id
      JOIN responses r
      ON r.question_id= q.question_id
      JOIN plants p
      ON p.plant_id = q.plant_id)
      UNION ALL
      (SELECT p.name, p.plant_id
      FROM users u1
      JOIN questions q
      ON q.user_id=u1.user_id
      JOIN plants p
      ON p.plant_id = q.plant_id)) as counts
  GROUP BY counts.plant_id, counts.name
  ORDER BY count DESC
      `;
// Query for users ordered by questions/comments
let users_query = `
    SELECT counts.user_id, counts.username, SUM(counts.count) as count
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
    GROUP BY counts.user_id, counts.username
    ORDER BY count DESC
  `;

// Query for plants a user commented on
async function get_user_plants(id) {
  let user_plants = await db.query(`
SELECT DISTINCT *
FROM ((SELECT u1.user_id, u1.username, p.plant_id, p.name
  FROM users u1, plants p, questions q
  WHERE u1.user_id = q.user_id AND q.plant_id = p.plant_id)
  UNION
  (SELECT u1.user_id, u1.username, p.plant_id, p.name
  FROM users u1, plants p, responses r, questions q
  WHERE u1.user_id = r.user_id AND q.plant_id = p.plant_id AND q.question_id = r.question_id)) as user_plants
WHERE user_plants.user_id = '${id}'
  `);
  return user_plants;
}

// Get popular plants
async function getPopularPlants() {
  let response = await db.query(plants_query);
  console.log(response.rows);
  let html_results = [];
  index = Math.min(10, response.rows.length);
  for (let i = 0; i < index; ++i) {
    image_url = await getTrefleImg(response.rows[i].plant_id);
    html_results.push([
      response.rows[i].name,
      image_url,
      response.rows[i].plant_id,
    ]);
  }
  return html_results;
}

// Get popular users
async function getPopularUsers() {
  let users = await db.query(users_query);
  let results = [];
  index = Math.min(10, users.rows.length);
  for (let i = 0; i < index; ++i) {
    let popular_user_plants = await get_user_plants(users.rows[i].user_id);
    console.log(popular_user_plants.rows);
    user_plant_ids = [];
    user_plant_names = [];
    user_plant_urls = [];
    for (let i = 0; i < popular_user_plants.rows.length; i++) {
      user_plant_ids.push(popular_user_plants.rows[i].plant_id);
      user_plant_names.push(popular_user_plants.rows[i].name);
      image_url = await getTrefleImg(popular_user_plants.rows[i].plant_id);
      user_plant_urls.push(image_url);
    }
    results.push([
      users.rows[i].username,
      user_plant_ids,
      user_plant_names,
      user_plant_urls,
    ]);
    return results;
  }
}

exports.getPopularPlants = getPopularPlants;
exports.getPopularUsers = getPopularUsers;
