const express = require("express");
const authController = require("../controllers/auth-controller");
const authCheck = require("../middlewares/auth-check");

const router = express.Router();

router.get("/available-phone", authController.availablePhoneNumber);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forget", authController.forgotPIN);

router.post(
  "/reset-PIN",authCheck ,authController.resetUserPIN
);


module.exports = router;
