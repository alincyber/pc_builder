const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");

const { authenticateUser } = require("../middleware/auth.middleware");

router.get("/profile", authenticateUser, userController.getProfile);

// GET Users
router.get("/", userController.getUsers);

// Register User
router.post("/register", userController.registerUser);

// Login User
router.post("/login", userController.loginUser);

module.exports = router;