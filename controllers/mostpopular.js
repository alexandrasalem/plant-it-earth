const { response } = require("express");
var db = require("../database");

async function getPopularPlants() {
  try {
    let response = await db.query(`
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
    ORDER BY count
      `);
    // clean = [];
    // for (let i = 0; i < response.rows.length; ++i) {

    // }
    return response;
  } catch (error) {
    console.log(error);
  }
}

exports.getPopularPlants = getPopularPlants;
