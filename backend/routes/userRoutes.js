const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require("../controllers/userController");
const { isRegisteredUser } = require("../middleware/authMiddleware");  // Protect middleware

// Route to register a new user
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Route to get the user's profile (protected)
router.get("/profile", isRegisteredUser, getUserProfile);

module.exports = router;
