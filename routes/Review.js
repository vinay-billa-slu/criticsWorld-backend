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

// Get a specific review
router.post("/getReview", verifyToken, async (req, res, next) => {
  try {
    console.log("Fetching review for:", req.body); // Log the incoming request
    const result = await reviewController.getReview(req.body);
    res.status(200).send({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Delete a review
router.post("/deleteReview", verifyToken, async (req, res, next) => {
  try {
    console.log("Deleting review:", req.body); // Log the incoming request
    await reviewController.deleteReview(req.body, req.user);
    res.status(200).send({ success: true, message: "Review has been deleted" });
  } catch (error) {
    next(error);
  }
});

// Update a review
router.post("/updateReview", verifyToken, async (req, res, next) => {
  try {
    console.log("Updating review:", req.body); // Log the incoming request
    const result = await reviewController.updateReview(req.body, req.user);
    res.status(200).send({
      success: true,
      message: "Review has been updated",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
