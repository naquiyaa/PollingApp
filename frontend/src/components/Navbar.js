import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);

    // Force a page reload to reset any client-side state
    window.location.reload(); // This will reload the entire page and reset all states

    // Redirect to the home page (after reload)
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Polling App
        </Typography>
        {isAuthenticated ? (
          <div>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {userName}
            </Typography>
          </div>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
