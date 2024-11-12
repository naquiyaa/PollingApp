const express = require("express");
const router = express.Router();
const { createPoll, getPolls, votePoll, updatePoll, deletePoll, getPollsByUser } = require("../controllers/pollController");
const { isRegisteredUser } = require("../middleware/authMiddleware");  // Protect middleware

// Route to create a new poll (protected)
router.post("/", isRegisteredUser, createPoll);

// Route to get all polls
router.get("/", getPolls);

router.get("/user/:userId", getPollsByUser);


// Route to vote on a poll
router.post("/vote", votePoll);

// Route to update a poll (protected)
router.put("/:pollId", isRegisteredUser, updatePoll);

// Route to delete a poll (protected)
router.delete("/:id", isRegisteredUser, deletePoll);

module.exports = router;
