import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Alert, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);  // State for password visibility
  const navigate = useNavigate();

  const handleLogin = async () => {
    let isValid = true;

    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    setLoginError(''); // Clear any previous login error

    // Validation checks
    if (!email) {
      setEmailError('Email cannot be empty');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password cannot be empty');
      isValid = false;
    }

    if (!isValid) return;

    try {
      await loginUser({ email, password });
      setIsAuthenticated(true);
      navigate('/');  // Redirect to home page after successful login
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Invalid email or password');  // Set the error message
    }
  };

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" gutterBottom marginTop={5}>
        Login
      </Typography>

      {/* Display login error if it exists */}
      {loginError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loginError}
        </Alert>
      )}

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        error={!!emailError}
        helperText={emailError}
      />
      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}  // Toggle between 'text' and 'password'
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        error={!!passwordError}
        helperText={passwordError}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button variant="contained" color="secondary" fullWidth onClick={handleLogin} sx={{ mt: 2 }}>
        Login
      </Button>
    </Container>
  );
};

export default Login;
