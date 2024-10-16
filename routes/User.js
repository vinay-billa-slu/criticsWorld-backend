const router = require("express").Router();
const userController = require("../controllers/User");
const { verifyTokenAndAdmin, verifyToken } = require("../middleware/Auth");

router.post("/getAllUsers", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const result = await userController.getAllUsers();
    res.status(200).send({ success: true, data: result, total: result.length });
  } catch (error) {
    next(error);
  }
});

router.post("/getUser", verifyToken, async (req, res, next) => {
  try {
    const result = await userController.getUser(req.body);
    res.status(200).send({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post("/deleteUser", verifyToken, async (req, res, next) => {
  try {
    await userController.deleteUser(req.body);
    res.status(200).send({ success: true, message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
});

router.post("/updateUser", verifyToken, async (req, res, next) => {
  try {
    const result = await userController.updateUser(req.body);
    res
      .status(200)
      .send({ success: true, message: "User has been updated", data: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
