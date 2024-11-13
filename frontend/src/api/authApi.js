import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 

// Helper function to save the token to localStorage
const saveToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);  // Save token to localStorage
    
  }
};

// Helper function for handling API requests
const apiRequest = async (method, url, data = {}) => {
  try {
    const response = await axios({
      method,
      url: `${API_URL}${url}`,
      data,
    });
    return response.data;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} ${url}:`, error);
    throw error;
  }
};

// Register a user
export const registerUser = async (userData) => {
  const response = await apiRequest('post', '/users/register', userData);
  const token = response.token; // Ensure that token exists in the response
  saveToken(token); // Save token if available
  return response.token;
};

// Login a user
export const loginUser = async (userData) => {
  const response = await apiRequest('post', '/users/login', userData);
  const token = response.token;
  saveToken(token);  // Save token if available
  return response.token;
};
