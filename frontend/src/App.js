import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { CssBaseline } from "@mui/material";
import { getUser } from "../src/api/userApi"; // Import your getUser API

// Create a theme using Material UI's createTheme function
const theme = createTheme({
  palette: {
    primary: {
      main: "#AA4A44", // Change primary color as needed
    },
    secondary: {
      main: "#800020", // Change secondary color as needed
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      getUser(token)
        .then((userData) => {
          localStorage.setItem("userId", userData.userId);
          localStorage.setItem("userEmail", userData.email);
          localStorage.setItem("userName", userData.name);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsAuthenticated(false);
        });
    }
  }, [token]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <Routes>
          {/* Redirect to home if authenticated and trying to access login or register */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Register setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
