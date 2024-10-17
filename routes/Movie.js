const router = require("express").Router();
const movieController = require("../controllers/Movie");
const { verifyTokenAndAdmin, verifyToken } = require("../middleware/Auth");

router.post("/addMovie", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    await movieController.addMovie(req.body);
    res.status(200).send({ success: true, message: "Movie Added" });
  } catch (error) {
    next(error);
  }
});

router.post("/getAllMovies", verifyToken, async (req, res, next) => {
  try {
    const result = await movieController.getAllMovies();
    res.status(200).send({ success: true, data: result, total: result.length });
  } catch (error) {
    next(error);
  }
});

router.post("/getMovie", verifyToken, async (req, res, next) => {
  try {
    const result = await movieController.getMovie(req.body);
    res.status(200).send({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post("/deleteMovie", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    await movieController.deleteMovie(req.body);
    res.status(200).send({ success: true, message: "Movie has been deleted" });
  } catch (error) {
    next(error);
  }
});

router.post("/updateMovie", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const result = await movieController.updateMovie(req.body);
    res
      .status(200)
      .send({ success: true, message: "Movie has been updated", data: result });
  } catch (error) {
    next(error);
  }
});

router.post("/searchMovie", verifyToken, async (req, res, next) => {
  try {
    const result = await movieController.searchMovie(req.body);
    res
      .status(200)
      .send({ success: true, message: "Movie's listed", data: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
