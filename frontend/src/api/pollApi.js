import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Your backend URL

// Helper function for handling API requests
const apiRequest = async (method, url, data = {}, token = "") => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios({
      method,
      url: `${API_URL}${url}`,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} ${url}:`, error);
    throw error;
  }
};

// Fetch all polls
export const fetchPolls = async () => {
  return apiRequest("get", "/polls/");
};

// Vote on a poll
export const votePoll = async (pollId, optionId) => {
  return apiRequest("post", "/polls/vote", { pollId, optionId });
};

// Fetch poll details by ID
export const fetchPollDetails = async (pollId) => {
  return apiRequest("get", `/polls/${pollId}`);
};

// Fetch polls created by a user
export const fetchUserPolls = async (userId) => {
  return apiRequest("get", `/polls/user/${userId}`);
};

// Create a poll (authenticated users only)
export const createPoll = async (pollData, token) => {
  return apiRequest("post", "/polls", pollData, token);
};

// Update a poll (authenticated users only)
export const updatePoll = async (pollId, pollData, token) => {
  return apiRequest("put", `/polls/${pollId}`, pollData, token);
};

// Delete a poll (authenticated users only)
export const deletePoll = async (pollId, token) => {
  return apiRequest("delete", `/polls/${pollId}`, {}, token);
};
