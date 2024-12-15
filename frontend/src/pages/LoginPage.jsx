import React, { useState } from "react";
import { TextField, Box, Typography, Button } from "@mui/material";

import { Link } from "react-router-dom";
import "../styles/LandgingPage.css";
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      setUsername(value);
    } else {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    console.log("username", username, "password", password);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "400px", // Set the desired width
          margin: "0 auto", // Center the box horizontally
          padding: "20px",
          boxShadow: 3, // Optional for styling
          borderRadius: "8px", // Optional for styling
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>

        <TextField
          required
          label="Username / Email ID / Mobile Number"
          name="username"
          value={username}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          required
          label="Enter password"
          name="password"
          value={password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            mt: 2,
            mx: "auto", // Horizontal center
            display: "block", // Ensures the button behaves like a block element
          }}
        >
          Login
        </Button>

        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </Box>
    </Box>
  );
};

export default LoginPage;
