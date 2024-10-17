const router = require("express").Router();
const userController = require("../controllers/User");
const { verifyToken } = require("../middleware/Auth");
const jwt = require("jsonwebtoken");
const CryptoJs = require("crypto-js");
const config = require("../config");
const { sendMail } = require("../controllers/sendMail");
const { connectToDatabase } = require("../config/db");


router.post("/register", async (req, res, next) => {
  try {
    await userController.addUser(req.body);
    res.status(200).send({ success: true, message: "Successfully registered" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await userController.loginUser(req.body);
    res
      .status(200)
      .send({ success: true, message: "Successfully logged in", data: user });
  } catch (error) {
    next(error);
  }
});

router.post("/verifyUser", verifyToken, async (req, res, next) => {
  try {
    res
      .status(200)
      .send({ success: true, message: "User verified", data: req.user });
  } catch (error) {
    next(error);
  }
});

router.post("/profile", verifyToken, async (req, res, next) => {
  try {
    const user = req.user;
    const data = await userController.getUser({ UserID: user.UserID });
    res.status(200).send({ success: true, data: data });
  } catch (error) {
    next(error);
  }
});

router.post("/profileDelete", verifyToken, async (req, res, next) => {
  try {
    const user = req.user;
    await userController.deleteUser({ UserID: user.UserID });
    res
      .status(200)
      .send({ success: true, message: "Profile has been deleted" });
  } catch (error) {
    next(error);
  }
});

router.post("/profileUpdate", verifyToken, async (req, res, next) => {
  try {
    const user = req.user;
    const body = { ...req.body, UserID: user.UserID };
    await userController.updateUser(body);
    res
      .status(200)
      .send({ success: true, message: "Profile has been updated" });
  } catch (error) {
    next(error);
  }
});

router.post("/resetLink", async (request, response) => {
  try {
    const body = request.body;

    const user = await userController.getUserByEmail(body);

    !user &&
      response.status(404).send({
        status: false,
        message: "User not found",
      });

    const token = jwt.sign(
      {
        Email: body.Email,
      },
      config.JWT_SEC_KEY,
      {
        expiresIn: "5m",
      }
    );

    // const link = `https://desktop-laptop-services-frontend.vercel.app/resetPassword/${token}/${user._id}`;
    const link = `http://localhost:5173/resetPassword/${token}/${user.UserID}`;

    sendMail(user.Email, link);

    response.status(200).send({
      success: true,
      message: "Password reset link has sent",
    });
  } catch (error) {
    response.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/resetPassword", verifyToken, async (request, response) => {
  try {
    const body = request.body;

    // await jwt.verify(body.token, config.JWT_SEC_KEY);

    const newpassword = CryptoJs.AES.encrypt(
      body.Password,
      config.JWT_SEC_KEY
    ).toString();

    const connection = await connectToDatabase();
    const query = "UPDATE User SET Password=? WHERE Email=?;";
    const [result] = await connection.query(query, [newpassword, request.user.Email]);

    response.status(200).send({
      success: true,
      message: "Password changed",
    });
  } catch (error) {
    response.status(500).send({
      success: false,
      message: "Token expired",
    });
  }
});

module.exports = router;
