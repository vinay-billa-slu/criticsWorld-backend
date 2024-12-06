const router = require("express").Router();
const reviewController = require("../controllers/Review");
const { verifyToken } = require("../middleware/Auth");

// Health check route to ensure the server is running
router.get("/ping", (req, res) => {
  res.status(200).send({ success: true, message: "Server is running" });
});

// Add a review
router.post("/addReview", verifyToken, async (req, res, next) => {
  try {
    console.log("Adding review:", req.body); // Log the incoming request
    await reviewController.addReview(req.body);
    res.status(200).send({ success: true, message: "Review Added" });
  } catch (error) {
    next(error);
  }
});

// Get all reviews
router.post("/getAllReviews", verifyToken, async (req, res, next) => {
  try {
    console.log("Fetching all reviews"); // Log the incoming request
    const result = await reviewController.getAllReviews(req.body);
    res.status(200).send({ success: true, data: result, total: result.length });
  } catch (error) {
    next(error);
  }
});
