const { connectToDatabase } = require("../config/db");
const HttpException = require("../middleware/HttpException");
const Joi = require("joi");
const config = require("../config");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

const loginUser = async (body) => {
  const schema = Joi.object().keys({
    Email: Joi.string().email().required(),
    Password: Joi.string().min(6).max(15).required(),
  });

  const result = schema.validate(body);

  if (result.error) {
    throw new HttpException(false, 400, result.error.details[0].message);
  } else {
    const connection = await connectToDatabase();
    const [rows] = await connection.query(
      "SELECT UserID, FirstName, LastName, Email, Password, Timestamp, isAdmin FROM User where Email=?",
      [body.Email]
    );
    const user = rows.length > 0 ? rows[0] : null;
    if (!user) {
      throw new HttpException(false, 401, "Wrong Credentials");
    } else {
      const hashedPassword = CryptoJs.AES.decrypt(
        user.Password,
        config.JWT_SEC_KEY
      ).toString(CryptoJs.enc.Utf8);

      if (body.Password !== hashedPassword) {
        throw new HttpException(false, 401, "Wrong Credentials");
      }

      const { Password, ...newUser } = user;

      const authToken = jwt.sign(
        {
          UserID: newUser.UserID,
          // Email: newUser.Email,
          isAdmin: newUser.isAdmin,
        },
        config.JWT_SEC_KEY,
        {
          expiresIn: "24h",
        }
      );

      return { ...newUser, token: authToken };
    }
  }
};

const addUser = async (body) => {
  const schema = Joi.object().keys({
    FirstName: Joi.string().min(3).max(15).required(),
    LastName: Joi.string().min(3).max(15).required(),
    Email: Joi.string().email().required(),
    Password: Joi.string().min(6).max(15).required(),
    isAdmin: Joi.number().optional(),
  });

  const result = schema.validate(body);

  if (result.error) {
    throw new HttpException(false, 400, result.error.details[0].message);
  } else {
    const user = await getUser({ Email: body.Email });
    if (user) {
      throw new HttpException(false, 400, "User already existed");
    } else {
      const q = body.isAdmin
        ? "INSERT INTO User (FirstName, LastName, Email, Password, isAdmin) VALUES (?);"
        : "INSERT INTO User (FirstName, LastName, Email, Password) VALUES (?);";

      body.Password = CryptoJs.AES.encrypt(
        body.Password,
        config.JWT_SEC_KEY
      ).toString();

      const values = body.isAdmin
        ? [
            body.FirstName,
            body.LastName,
            body.Email,
            body.Password,
            body.isAdmin,
          ]
        : [body.FirstName, body.LastName, body.Email, body.Password];

      const connection = await connectToDatabase();
      await connection.query(q, [values]);
    }
  }
};

const getAllUsers = async () => {
  const connection = await connectToDatabase();
  const [rows] = await connection.query(
    "SELECT UserID, FirstName, LastName, Email, Timestamp FROM User"
  );
  return rows;
};

const getUser = async (body) => {
  const connection = await connectToDatabase();
  const [rows] = await connection.query(
    "SELECT UserID, FirstName, LastName, Email, Timestamp, isAdmin FROM User where UserID=?",
    [body.UserID]
  );
  return rows.length > 0 ? rows[0] : null;
};

const getUserByEmail = async (body) => {
  const connection = await connectToDatabase();
  const [rows] = await connection.query(
    "SELECT UserID, FirstName, LastName, Email, Timestamp, isAdmin FROM User where Email=?",
    [body.Email]
  );
  return rows.length > 0 ? rows[0] : null;
};

const deleteUser = async (body) => {
  const connection = await connectToDatabase();
  const user = await getUser(body);
  if (user) {
    await connection.query("DELETE from Review where UserID=?", [body.UserID]);
    await connection.query("DELETE from User where UserID=?", [body.UserID]);
  } else {
    throw new HttpException(true, 200, "No such user");
  }
};

const updateUser = async (body) => {
  const schema = Joi.object().keys({
    FirstName: Joi.string().min(3).max(15).required(),
    LastName: Joi.string().min(3).max(15).required(),
    Email: Joi.string().email().required(),
    Password: Joi.string().optional(),
    UserID: Joi.number().required(),
  });

  const result = schema.validate({
    FirstName: body.FirstName,
    LastName: body.LastName,
    Email: body.Email,
    UserID: body.UserID,
  });

  if (result.error) {
    throw new HttpException(false, 400, result.error.details[0].message);
  } else {
    if (body.Password && body.Password.length < 6) {
      throw new HttpException(
        false,
        400,
        "Password must be atleast 6 characters"
      );
    }
    const connection = await connectToDatabase();
    const [rows] = await connection.query(
      "SELECT UserID, FirstName, LastName, Email, Password FROM User where UserID=?",
      [body.UserID]
    );
    const user = rows.length > 0 ? rows[0] : null;
    if (user) {
      const hashedPassword = CryptoJs.AES.decrypt(
        user.Password,
        config.JWT_SEC_KEY
      ).toString(CryptoJs.enc.Utf8);

      const encryptedPassword = CryptoJs.AES.encrypt(
        body.Password,
        config.JWT_SEC_KEY
      ).toString();

      const values = body.Password
        ? [
            body.FirstName,
            body.LastName,
            body.Email,
            encryptedPassword,
            // body.Password != hashedPassword ? encryptedPassword : user.Password,
            body.UserID,
          ]
        : [body.FirstName, body.LastName, body.Email, body.UserID];

      const q = body.Password
        ? "UPDATE User SET FirstName=?, LastName=?, Email=?, Password=? where UserID=?"
        : "UPDATE User SET FirstName=?, LastName=?, Email=? where UserID=?";

      await connection.query(q, values);
    } else {
      throw new HttpException(true, 200, "No such user");
    }
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUser,
  getUserByEmail,
  loginUser,
  deleteUser,
  updateUser,
};
