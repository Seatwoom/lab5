require("dotenv").config();
const { Pool } = require("pg");

const mainPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: "postgres",
});

const checkAndCreateDatabase = async () => {
  try {
    const checkResult = await mainPool.query(
      "SELECT datname FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );

    if (checkResult.rows.length === 0) {
      console.log(
        `Database ${process.env.DB_NAME} does not exist. Creating it now...`
      );
      await mainPool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Database ${process.env.DB_NAME} created successfully.`);
    } else {
      console.log(`Database ${process.env.DB_NAME} already exists.`);
    }
  } catch (error) {
    console.error("Error checking/creating database:", error);
    throw error;
  } finally {
    await mainPool.end();
  }
};

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = { pool, checkAndCreateDatabase };
