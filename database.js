const pg = require('pg');
// const creds = require("./credentials");

/**
 * SQL connection details
 */
const connectionName =
  process.env.INSTANCE_CONNECTION_NAME || 'plantit-296404:us-central1:plantit';
const dbUser = process.env.SQL_USER || 'postgres';
const dbPassword = process.env.SQL_PASSWORD //|| creds.dbpass;
const dbName = process.env.SQL_NAME || 'postgres';
const host = '35.239.186.62';

const pgConfig = {
  max: 1,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  host: host,
  port: 5432,
};

if (process.env.NODE_ENV === "production") {
  pgConfig.host = `/cloudsql/${connectionName}`;
}

// Connection pools reuse connections between invocations,
// and handle dropped or expired connections automatically.
let pgPool;

if (!pgPool) {
  pgPool = new pg.Pool(pgConfig);
}

module.exports = pgPool;
