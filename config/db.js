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

const environment = process.env;

const pool = mysql.createPool({
  host: environment.DB_HOST ? "sql12.freemysqlhosting.net" : config.HOST,
  user: environment.DB_USER ? "sql12667445" : config.USER,
  port: config.DB_PORT,
  password: environment.DB_PASSWORD ? "MAAQQXwLVN" : config.PASSWORD,
  database: environment.DATABASE ? "sql12667445" : config.DATABASE,
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
