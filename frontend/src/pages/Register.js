import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "../components/RegistrationForm";
import { registerUser } from "../api/authApi";
import { Alert } from "@mui/material";
import { getUser } from '../api/userApi';

const Register = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); // To store and display error messages

  const handleRegistration = async (userData) => {
    try {
      const token= await registerUser(userData); // Get the token from API response
      const userInfo = await getUser(token);
      localStorage.setItem("userId", userInfo.userId);
      localStorage.setItem("userEmail", userInfo.email);
      localStorage.setItem("userName", userInfo.name);
      setIsAuthenticated(true);
      navigate("/"); // Redirect to the home page
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Capture the error message from the backend response
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Failed to register user");
      }
    }
  };

  return (
    <div>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <RegistrationForm onSubmit={handleRegistration} />
    </div>
  );
};

export default Register;
