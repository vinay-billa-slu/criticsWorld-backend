const router = require("express").Router();
const reviewController = require("../controllers/Review");
const { verifyToken } = require("../middleware/Auth");

// Health check route to ensure the server is running
router.get("/ping", (req, res) => {
  res.status(200).send({ success: true, message: "Server is running" });
});


