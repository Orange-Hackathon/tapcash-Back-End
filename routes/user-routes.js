const express = require("express");
const userController = require("../controllers/user-controller");
const startUploadSinglePhoto = require("../utils/upload-single-photo");
const authCheck = require("../middlewares/auth-check");
const resizeUserPhoto = require("../middlewares/resize-user-photo");

const router = express.Router();

router.post(
  "/me/upload-user-photo",
  authCheck,
  startUploadSinglePhoto,
  resizeUserPhoto,
  userController.uploadUserPhoto
);
router.post("/transfer-money", authCheck, userController.transferMoney);
router.post("/pay-bill", authCheck, userController.payBill);
router.post("/add-restricted-category", authCheck, userController.addRestrictedCategory);
 router.post("/remove-restricted-category", authCheck, userController.removeRestrictedCategory);
 router.get("/get-info",authCheck,userController.getInfo);
 router.post("/add-son", authCheck, userController.addSon);
 router.post("/get-child-info", authCheck, userController.getChildInfo);
 router.get("/get-transactions", authCheck, userController.getTransactions);
 router.post("/update-email", authCheck, userController.updateEmail);



module.exports = router;
