import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Input,
} from "@mui/material";
import {
  fetchPolls,
  votePoll,
  fetchUserPolls,
  createPoll,
  updatePoll,
} from "../api/pollApi"; // Import the API functions
import PollCard from "../components/PollCard"; // Import the PollCard component

const Home = () => {
  const [polls, setPolls] = useState([]); // All polls
  const [userPolls, setUserPolls] = useState([]); // Polls created by the logged-in user
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // To track if user is logged in
  const [viewingUserPolls, setViewingUserPolls] = useState(false); // State to toggle between user and all polls
  const [openDialog, setOpenDialog] = useState(false); // State to manage dialog visibility
  const [currentPoll, setCurrentPoll] = useState(null); // Store the poll being edited or null if creating a new poll
  const [pollQuestion, setPollQuestion] = useState(""); // Store poll question
  const [pollOptions, setPollOptions] = useState([""]); // Store poll options (array of options)
  const [pollImage, setPollImage] = useState(null); // Store the base64 image for poll
  const [imageFileName, setImageFileName] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsUserLoggedIn(true);
      fetchUserPollsByUser(); // Fetch polls created by the logged-in user
    } else {
      console.log("User is not logged in."); // Debugging
      setIsUserLoggedIn(false);
    }
  }, []);

  // Fetch all polls for non-logged-in users
  useEffect(() => {
    const getPolls = async () => {
      try {
        const data = await fetchPolls(); // Fetch poll data
        setPolls(data); // Set polls in the state
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    getPolls(); // Fetch the polls
  }, []);

  // Fetch polls created by the logged-in user
  const fetchUserPollsByUser = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetchUserPolls(userId); // Fetch user-specific polls
      setUserPolls(response); // Set user polls in state
    } catch (error) {
      console.error("Error fetching user polls:", error);
    }
  };

  // Handle voting for a poll
  const handleVote = async (pollId, optionId) => {
    try {
      const response = await votePoll(pollId, optionId); // Call vote API
      // Update the poll with the new vote count in the state
      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll._id === pollId
            ? {
                ...poll,
                options: poll.options.map((option) =>
                  option._id === optionId
                    ? { ...option, votes: option.votes + 1 }
                    : option
                ),
              }
            : poll
        )
      );
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  // Handle opening the dialog for creating a new poll
  const handleCreatePoll = () => {
    console.log("Opening dialog to create a new poll"); // Debugging
    setPollQuestion("");
    setPollOptions([""]); // Reset options
    setPollImage(null); // Reset image
    setCurrentPoll(null); // Set to null for creating a new poll
    setOpenDialog(true); // Open the dialog
  };

  // Handle opening the dialog for editing an existing poll
  const handleEditPoll = (poll) => {
    console.log("Editing poll:", poll); // Debugging
    console.log("pol.image", poll.image)
    setPollQuestion(poll.question);
    setPollOptions(poll.options.map((option) => option.text)); // Populate options
    setPollImage(poll.image); // Set existing image
    setImageFileName(
      "Image selected"
    )
    setCurrentPoll(poll); // Set the current poll being edited
    setOpenDialog(true); // Open the dialog
  };

  // Handle submitting the poll (either creating or updating)
  const handleSubmitPoll = async () => {
    if (!pollQuestion || pollOptions.length < 2 || !pollImage) {
      alert("Poll must have a question and at least two options and an image.");
      console.log(
        "Poll is invalid. Must have a question and at least two options, and an image."
      ); // Debugging
      return;
    }

    console.log("poll options: ", pollOptions);

    const pollData = {
      question: pollQuestion,
      options: pollOptions.map((option) => ({ text: option, votes: 0 })),
      image: pollImage, // Include the image in poll data
    };

    try {
      if (currentPoll) {
        console.log("Updating existing poll:", currentPoll._id); // Debugging
        // Update poll if editing an existing poll
        const updatedPoll = await updatePoll(
          currentPoll._id,
          pollData,
          localStorage.getItem("token")
        );
        console.log("Updated poll:", updatedPoll); // Debugging
        setPolls((updatedPoll) => updatedPoll.map((poll) => poll));
      } else {
        console.log("Creating a new poll"); // Debugging
        // Create new poll
        const newPoll = await createPoll(
          pollData,
          localStorage.getItem("token")
        );
        console.log("Created new poll:", newPoll); // Debugging
        setPolls((newPoll) => newPoll.map((poll) => poll));
      }

      // Close dialog after submitting
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving poll:", error);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    console.log("Closing poll creation/editing dialog"); // Debugging
    setOpenDialog(false);
  };

  // Handle changes to poll options
  const handleOptionChange = (index, value) => {
    console.log(`Option ${index} changed to: ${value}`); // Debugging
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleAddOption = () => {
    console.log("Adding new option"); // Debugging
    setPollOptions((prevOptions) => [...prevOptions, ""]); // Add an empty option
  };

  // Handle image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the file size is greater than 1MB
      if (file.size > 1024 * 1024) {
        alert("File size should not be greater than 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPollImage(reader.result); // Save base64 image string
        setImageFileName(file.name);
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  // Toggle between showing all polls and user polls
  const togglePollView = () => {
    setViewingUserPolls(!viewingUserPolls);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom marginTop={5}>
        Polls
      </Typography>

      {/* Show the Create New Poll button only if the user is logged in */}
      {isUserLoggedIn && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreatePoll}
          style={{ marginBottom: "20px" }}
        >
          Create New Poll
        </Button>
      )}

      {/* Button to toggle between all polls and user polls */}
      {isUserLoggedIn && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={togglePollView}
          style={{ marginBottom: "20px", marginLeft: "20px" }}
        >
          {viewingUserPolls ? "View All Polls" : "View Your Polls"}
        </Button>
      )}

      {/* Show both user polls and all polls */}
      <Typography variant="h6" gutterBottom marginTop={5}>
        {viewingUserPolls ? "Your Polls" : "All Polls"}
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={2}>
        {/* Show the user's polls if viewingUserPolls is true */}
        {(viewingUserPolls ? userPolls : polls).map((poll) => (
          <Box key={poll._id} width="calc(33.33% - 16px)">
            <PollCard
              poll={poll}
              handleVote={handleVote}
              onEdit={handleEditPoll}
              isUserLoggedIn={poll.createdBy === localStorage.getItem("userId")}
              userId={localStorage.getItem("userId")}
            />
          </Box>
        ))}
      </Box>

      {/* Dialog for creating/editing polls */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentPoll ? "Edit Poll" : "Create Poll"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Poll Question"
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            fullWidth
            margin="normal"
          />
          {pollOptions.map((option, index) => (
            <TextField
              key={index}
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              fullWidth
              margin="normal"
            />
          ))}
          <Button onClick={handleAddOption} color="primary">
            Add Option
          </Button>

          {/* Image Upload */}
          <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: "20px" }}
          />
          </div>

          {/* Image preview */}
      {pollImage && (
        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <img
            src={pollImage}
            alt="Poll Preview"
            style={{ width: "100%", maxWidth: "400px", height: "auto" }}
          />
        </div>
      )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitPoll} color="primary">
            {currentPoll ? "Update Poll" : "Create Poll"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home;
