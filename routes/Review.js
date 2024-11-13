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

router.post("/getAllReviews", verifyToken, async (req, res, next) => {
  try {
    const result = await reviewController.getAllReviews(req.body);
    res.status(200).send({ success: true, data: result, total: result.length });
  } catch (error) {    
    next(error);
  }
});

router.post("/getReview", verifyToken, async (req, res, next) => {
  try {
    const result = await reviewController.getReview(req.body);
    res.status(200).send({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post("/deleteReview", verifyToken, async (req, res, next) => {
  try {
    await reviewController.deleteReview(req.body, req.user);
    res.status(200).send({ success: true, message: "Review has been deleted" });
  } catch (error) {
    next(error);
  }
});

router.post("/updateReview", verifyToken, async (req, res, next) => {
  try {
    const result = await reviewController.updateReview(req.body, req.user);
    res
      .status(200)
      .send({
        success: true,
        message: "Review has been updated",
        data: result,
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
