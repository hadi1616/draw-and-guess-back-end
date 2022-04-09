const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const isDev = process.env.NODE_ENV === 'development';

const db = new pg.Pool({
  connectionString,
  ...(!isDev && { ssl: { rejectUnauthorized: false } }),
});

module.exports = db;
