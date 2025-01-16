import React, { useState, useContext } from "react";
import { TextField, Box, Typography, Button } from "@mui/material";
import { LoginUser } from "../api/userApi";
import { Link } from "react-router-dom";
import "../styles/LandgingPage.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../router/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      setUsername(value);
    } else {
      setPassword(value);
    }
  };

  //Handle Login API
  const handleSubmit = async (e) => {
    // console.log("username", username, "password", password);
    e.preventDefault();
    try {
      console.log("username", username);
      const isLoggedIn = await LoginUser(username, password);
      console.log("Login successful:", isLoggedIn);

      if (isLoggedIn) {
        setIsAuthenticated(true); // Update authentication state
        navigate("/dashboard");
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message);
    }
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
          label="Username"
          name="username"
          value={username}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          required
          label="Password"
          name="password"
          type="password"
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
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p style={{ textAlign: "center" }}>
          Don't have an account?
          <Link to="/signup" style={{ marginLeft: "6px" }}>
            Signup
          </Link>
        </p>
      </Box>
    </Box>
  );
};

export default LoginPage;
