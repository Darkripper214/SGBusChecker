const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  connectionLimit: process.env.SQL_CON_LIMIT,
  host: process.env.SQL_SERVER,
  port: process.env.SQL_PORT,
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_SCHEME,
  timezone: process.env.SQL_TIMEZONE,
});

const connectSQL = async () => {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
  console.log("SQL Connected...");
  return true;
};

module.exports = {
  connectSQL,
  pool,
};
