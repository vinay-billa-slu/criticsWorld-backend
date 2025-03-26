// const mysql = require("mysql2/promise");
// const config = require("./index");
// const HttpException = require("../middleware/HttpException");

// const connectToDatabase = async () => {
//   try {
//     const connection = await mysql.createConnection({
//       host: config.HOST,
//       user: config.USER,
//       password: config.PASSWORD,
//       database: config.DATABASE,
//     });
//     return connection;
//   } catch (err) {
//     // next(err);
//     console.log("Error in database connection!!");
//     throw new HttpException(false, 400, "Error in database connection!!");
//   }
// };

// module.exports = { connectToDatabase };

const mysql = require("mysql2/promise");
const config = require("./index");
const HttpException = require("../middleware/HttpException");
require('dotenv').config()
const environment = process.env;

console.log("env", process.env.DB_HOST);

const pool = mysql.createPool({
  host: environment.DB_HOST ? environment.DB_HOST : config.HOST,
  user: environment.DB_USER ? environment.DB_USER : config.USER,
  port: config.DB_PORT,
  password: environment.DB_PASSWORD ? environment.DB_PASSWORD : config.PASSWORD,
  database: environment.DATABASE ? environment.DATABASE : config.DATABASE,
  waitForConnections: true,
  // connectionLimit: 10, // Adjust according to your needs
  queueLimit: 0,
});

const connectToDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return connection;
  } catch (err) {
    console.error("Error in database connection:", err.message);
    throw new HttpException(false, 400, "Error in database connection");
  }
};

module.exports = { connectToDatabase };
