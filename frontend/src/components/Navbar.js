import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);

    // Force a page reload to reset any client-side state
    window.location.reload(); // This will reload the entire page and reset all states

    // Redirect to the home page (after reload)
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Polling App
          </Typography>
        </Link>
        <Box sx={{ display: "flex", marginLeft: "auto" }}>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
