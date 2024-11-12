const router = require("express").Router();
const reviewController = require("../controllers/Review");
const { verifyToken } = require("../middleware/Auth");

router.post("/addReview", verifyToken, async (req, res, next) => {
  try {
    await reviewController.addReview(req.body);
    res.status(200).send({ success: true, message: "Review Added" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
