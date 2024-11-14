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

// Connection pool configuration
const pool = mysql.createPool({
  host: environment.DB_HOST || config.HOST,
  user: environment.DB_USER || config.USER,
  port: environment.DB_PORT || config.DB_PORT,
  password: environment.DB_PASSWORD || config.PASSWORD,
  database: environment.DATABASE || config.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,  // Adjust this value as needed
  queueLimit: 0,
});

// Function to get a database connection
const connectToDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Return a connection with `query` and `release` methods
    return {
      query: connection.query.bind(connection),
      release: () => connection.release(),
    };
  } catch (err) {
    console.error("Error in database connection:", err.message);
    throw new HttpException(false, 500, "Error in database connection");
  }
};

module.exports = { connectToDatabase };
