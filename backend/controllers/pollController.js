const Poll = require("../models/Poll");
const axios = require("axios"); // To fetch image from URL
const { optimizeImageWithTinyPNG } = require("../utils/imageProcessor");

//utility function to process images
const processImage = async (image) => {
  let imageBuffer;

  if (image.startsWith("http")) {
    const response = await axios({ url: image, responseType: "arraybuffer" });
    imageBuffer = Buffer.from(response.data);
  } else {
    if (image.includes(",")) {
      base64String = image.split(",")[1];
    }
    else{
      base64String = image;
    }
    imageBuffer = Buffer.from(base64String, "base64");
  }

  // Optimize image
  return optimizeImageWithTinyPNG(imageBuffer);
};

const validateOptions = (options) =>
  options.filter((option) => typeof option.text === "string" && option.text.trim() !== "");

// Create a new poll
const createPoll = async (req, res) => {
  const { question, options, image } = req.body;

  try {
    // Validate options length
    if (options.length < 2 || options.length > 5) {
      return res.status(400).json({ message: "Poll must have between 2 and 5 options" });
    }

    const validOptions = validateOptions(options);

    //process the image
    let optimizedImage = null;
    if (image) {
      const { optimizedImageBuffer, initialSize, finalSize } = await processImage(image);
      console.log("Image optimized from", initialSize, "to", finalSize);
      optimizedImage = optimizedImageBuffer.toString("base64");
    }
    // Create the poll with the optimized image
    const poll = new Poll({
      question,
      options: validOptions.map((option) => ({ text: option.text, votes: 0 })),
      image: optimizedImage, // Store the optimized image
      createdBy: req.userId,
    });

    // Save the poll to the database
    await poll.save();

    const allPolls = await Poll.find();

    // Return success response with size details
    res.status(201).json({
      message: "Poll created successfully",
      polls: allPolls,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all polls
const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find();
    res.status(200).json(polls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//get all polls created by a specific user
const getPollsByUser = async (req, res) => {
  const { userId } = req.params; // Get the userId from the route parameters

  try {
    // Find all polls where the createdBy field matches the userId
    const polls = await Poll.find({ createdBy: userId });

    if (polls.length === 0) {
      return res.status(404).json({ message: "No polls found for this user." });
    }

    res.status(200).json(polls); // Send the found polls back in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Vote on a poll
const votePoll = async (req, res) => {
  const { pollId, optionId } = req.body;

  try {
    // Find the poll
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Find the selected option
    const option = poll.options.id(optionId);
    if (!option) {
      return res.status(404).json({ message: "Option not found" });
    }

    // Increment vote count
    option.votes += 1;

    // Save the poll with the updated votes
    await poll.save();

    // Return success response
    res.status(200).json({ message: "Vote registered successfully", poll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a poll (only if user is the creator)
const updatePoll = async (req, res) => {
  const { pollId } = req.params;
  const { question, options, image } = req.body;

  try {
    // Find the poll
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Check if user is the creator
    if (poll.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only update your own polls" });
    }

    // Validate options length
    if (options && (options.length < 2 || options.length > 5)) {
      return res.status(400).json({ message: "Poll must have between 2 and 5 options" });
    }

    // Update poll details
    const validOptions = validateOptions(options || []);
    poll.question = question || poll.question;
    // Update options if new ones are provided
    if (options) {
      poll.options = validOptions.map((option) => ({
        text: option.text,
        votes: 0,
      }));
    }

    // Handle image update (optimization before saving)
    if (image) {
      const { optimizedImageBuffer, initialSize, finalSize } = await processImage(image);
      console.log("Image optimized from", initialSize, "to", finalSize);
      poll.image = optimizedImageBuffer.toString("base64");
    }

    // Save the updated poll
    await poll.save();

    const allPolls = await Poll.find();

    // Return success response with all polls
    res.status(200).json({ message: "Poll updated successfully", polls: allPolls });

    // Return success response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a poll (only if user is the creator)
const deletePoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const userId = req.userId; // Assuming you have user info from middleware (like JWT auth)

    // Find the poll by its ID
    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).send({ message: "Poll not found" });
    }

    // Check if the logged-in user is the creator of the poll
    if (poll.createdBy.toString() !== userId.toString()) {
      return res.status(403).send({ message: "You can only delete your own polls" });
    }

    // Proceed with deletion if the user is the creator
    await Poll.findByIdAndDelete(pollId);

    res.status(200).send({ message: "Poll deleted successfully" });
  } catch (error) {
    console.error("Error deleting poll:", error);
    res.status(500).send({ message: "Server error" });
  }
};

module.exports = {
  createPoll,
  getPolls,
  votePoll,
  updatePoll,
  deletePoll,
  getPollsByUser,
};
