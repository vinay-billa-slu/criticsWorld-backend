const router = require("express").Router();
const reviewController = require("../controllers/Review");
const { verifyToken } = require("../middleware/Auth");

// Helper function to handle routes more cleanly
const handleRequest = (controllerMethod) => async (req, res, next) => {
  try {
    const result = await controllerMethod(req.body, req.user);
    res.status(200).send({ success: true, data: result || null, message: result ? "Success" : null });
  } catch (error) {
    next(error);
  }
};

router.post("/addReview", verifyToken, handleRequest(reviewController.addReview));

router.post("/getAllReviews", verifyToken, handleRequest(reviewController.getAllReviews));

router.post("/getReview", verifyToken, handleRequest(reviewController.getReview));

router.post("/deleteReview", verifyToken, handleRequest(async (body, user) => {
  await reviewController.deleteReview(body, user);
  return { message: "Review has been deleted" };
}));

router.post("/updateReview", verifyToken, handleRequest(reviewController.updateReview));

module.exports = router;
