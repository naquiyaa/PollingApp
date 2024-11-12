const Poll = require("../models/Poll");
const axios = require("axios"); // To fetch image from URL
const { optimizeImageWithTinyPNG } = require("../utils/imageProcessor");

// Create a new poll

const createPoll = async (req, res) => {
  const { question, options, image } = req.body;

  try {
    // Validate options length
    if (options.length < 2 || options.length > 5) {
      return res
        .status(400)
        .json({ message: "Poll must have between 2 and 5 options" });
    }

    let imageBuffer;

    // Check if the image is a URL or base64 string
    if (image.startsWith("http")) {
      // If it's a URL, fetch the image and convert it to a buffer
      const response = await axios({ url: image, responseType: "arraybuffer" });
      imageBuffer = Buffer.from(response.data);
    } else {

      // If it's a base64 string, remove the prefix and convert to buffer
      const base64String = image.split(",")[1]; // Split the string and take the part after the comma
      imageBuffer = Buffer.from(base64String, "base64"); // Convert the base64 part to a buffer
    }

    // Optimize the image using TinyPNG
    const { optimizedImageBuffer, initialSize, finalSize } =
      await optimizeImageWithTinyPNG(imageBuffer);
    console.log("initial size: ", initialSize);
    console.log("final size: ", finalSize);

    // Save the optimized image as base64 string
    const optimizedImage = optimizedImageBuffer.toString("base64"); // For base64 storage

    const validOptions = req.body.options.filter(
      (option) => typeof option.text === "string" && option.text.trim() !== ""
    );
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
      return res
        .status(403)
        .json({ message: "You can only update your own polls" });
    }

    // Validate options length
    if (options && (options.length < 2 || options.length > 5)) {
      return res
        .status(400)
        .json({ message: "Poll must have between 2 and 5 options" });
    }

    // Update poll details
    poll.question = question || poll.question;

    const validOptions = req.body.options.filter(
      (option) => typeof option.text === "string" && option.text.trim() !== ""
    );
    // Update options if new ones are provided
    if (options) {
      poll.options = validOptions.map((option) => ({
        text: option.text,
        votes: 0,
      }));
    }

    // Handle image update (optimization before saving)
    if (image) {
      if (image.startsWith("http")) {
        // If it's a URL, fetch the image and convert it to a buffer
        const response = await axios({
          url: image,
          responseType: "arraybuffer",
        });
        imageBuffer = Buffer.from(response.data);
      } else {
        // If it's a base64 string, convert it to a buffer
        const base64String = image.split(",")[1];
        imageBuffer = Buffer.from(base64String, "base64");
      }

      // Optimize the image using TinyPNG (or any other image optimization service)
      const { optimizedImageBuffer, initialSize, finalSize } =
        await optimizeImageWithTinyPNG(imageBuffer);

      // Convert optimized image to base64 and save the new size
      const optimizedImage = optimizedImageBuffer.toString("base64");
      poll.image = optimizedImage; // Save the optimized image
      poll.imageSize = {
        original: initialSize, // Original image size in bytes
        optimized: finalSize, // Optimized image size in bytes
      };
    } else {
      // If no image is provided, ensure imageSize is reset (if the image is not being updated)
      poll.imageSize = poll.imageSize || { original: 0, optimized: 0 };
    }

    // Save the updated poll
    await poll.save();

    const allPolls = await Poll.find();

    // Return success response with all polls
    res
      .status(200)
      .json({ message: "Poll updated successfully", polls: allPolls });

    // Return success response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a poll (only if user is the creator)
const deletePoll = async (req, res) => {
  const { pollId } = req.body;

  try {
    // Find the poll
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Check if user is the creator
    if (poll.createdBy.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own polls" });
    }

    // Delete the poll
    await poll.remove();

    // Return success response
    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
