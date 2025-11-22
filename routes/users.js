const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Registration route
router.post("/register", userController.registerUser);

// Login route
router.post("/login", userController.loginUser);

// Logout route
router.post("/logout", userController.logoutUser);

module.exports = router;
