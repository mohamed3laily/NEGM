const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.get(
  "/me",
  authController.protect,
  userController.getMe,
  userController.getUser
);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);

//router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

router.patch(
  "/updateMe",
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

module.exports = router;
