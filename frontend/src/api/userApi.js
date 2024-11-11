import axios from 'axios';

const API_URL = 'http://localhost:5000/api';  // Your backend URL

// Fetch the currently logged-in user's details
export const getUser = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching user data');
  }
};

