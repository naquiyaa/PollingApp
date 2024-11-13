// PollCard.js
import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const PollCard = ({ poll, handleVote, onEdit, onDelete, isUserLoggedIn, userId }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Open the delete confirmation dialog
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  // Close the delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Confirm deletion and call onDelete
  const confirmDelete = () => {
    onDelete(poll._id);
    setOpenDeleteDialog(false);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{poll.question}</Typography>
        {/* Display the image if available */}
        {poll.image && (
          <Box mb={2}>
            <img
              src={`data:image/jpeg;base64,${poll.image}`}
              alt="Poll visual"
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          </Box>
        )}

        {/* Display poll options */}
        <Box mt={2}>
          <Typography variant="body1">Options:</Typography>
          {poll.options.map((option) => (
            <Box key={option._id} mb={1}>
              <Typography variant="body2">
                {option.text} - {option.votes} votes
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleVote(poll._id, option._id)}>
                Vote
              </Button>
            </Box>
          ))}
        </Box>

        {/* Display Edit and Delete buttons if the user is logged in */}
        {isUserLoggedIn && userId === poll.createdBy && (
          <Box display="flex" justifyContent="flex-start" alignItems="center" gap="10px">
            <Button variant="outlined" color="secondary" onClick={() => onEdit(poll)} style={{ marginTop: "10px" }}>
              Edit
            </Button>
            <Button variant="outlined" color="error" onClick={handleOpenDeleteDialog} style={{ marginTop: "10px" }}>
              Delete
            </Button>
          </Box>
        )}

        {/* Confirmation Dialog for Deletion */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this poll? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PollCard;
