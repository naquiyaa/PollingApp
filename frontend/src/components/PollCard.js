// PollCard.js
import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';

const PollCard = ({ poll, handleVote, onEdit, isUserLoggedIn, userId }) => {
  console.log("naqu0: ", isUserLoggedIn)
  console.log("naqu1: ", poll.createdBy);
  console.log("naqu2: ", userId)
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
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
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
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleVote(poll._id, option._id)}
              >
                Vote
              </Button>
            </Box>
          ))}
        </Box>

        {/* Display Edit button if the user is logged in */}
        {isUserLoggedIn && userId === poll.createdBy && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => onEdit(poll)}
            style={{ marginTop: '10px' }}
          >
            Edit
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PollCard;
