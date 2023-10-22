const express = require("express");
const router = express.Router();

// controller
const {
  register,
  login,
  getCurrentUser,
  getUserById,
  update
} = require("../controllers/UserContoller");

// Middlewares
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
  userUpadateValidation,
} = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");
const {imageUpload} = require("../middlewares/imageUpload")

// routes
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);
router.put(
  "/",
  authGuard,
  userUpadateValidation(),
  validate,
  imageUpload.single("profileImage"), 
  update
);
router.get("/:id", getUserById)

module.exports = router;
