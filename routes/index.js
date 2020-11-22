var express = require("express");
var router = express.Router();
var path = require("path");

//--------------
//Required for Postgres
//if any one else uses make sure they are in the authorized list under connections
const pg = require('pg');
let pgPool;

const connectionName =
  process.env.INSTANCE_CONNECTION_NAME || 'plantit-296404:us-central1:plantit';
const dbUser = process.env.SQL_USER || 'postgres';
const dbPassword = process.env.SQL_PASSWORD || 'qwe123qwe';
const dbName = process.env.SQL_NAME || 'postgres';
const host = '35.239.186.62';

const pgConfig = {
  max: 1,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  host: host,
  port: 5432
};
//-----------

router.get("/pg", (req, res) => {

  //how to query post gres
  //--------
  if (!pgPool) {
    pgPool = new pg.Pool(pgConfig);
  }

  pgPool.query('SELECT * FROM test', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(JSON.stringify(results));
    }
  });
  //----------
});

router.get("/", (req, res) => {
  res.render("index");
  // res.sendFile(path.join(__dirname + '/../views/index.html'));
});

router.get("/test", (req, res) => {
  res.status(200);
  res.write("this is working this is WOOOOOOOORKIIIIIIIIIINGG");
  res.send();
});

module.exports = router;
