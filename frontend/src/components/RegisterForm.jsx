import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import {
  checkUsernameUniqueness,
  checkEmailUniqueness,
  checkMobileNumer,
  registerUser,
} from "../api/userApi";
import validateEmail from "../utils/validateEmail";
import debounceInput from "../utils/debounceInput";
import validateMobileNumber from "../utils/validateMobileNumber";

const RegisterForm = () => {
  //for username
  const [username, setUsername] = useState("");
  const [usernameErr, setUsernameErr] = useState("");

  //for email
  const [emailId, setEmailId] = useState("");
  const [emailError, setEmailError] = useState("");

  //for mobile number
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobNumErr, setMobNumErr] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    emailId: "",
    mobileNumber: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  //Debounced to Username API to check if it is unique.
  const debouncedCheckUsernameUniqueness = debounceInput(async (username) => {
    const isUnique = await checkUsernameUniqueness(username);
    if (!isUnique) {
      setUsernameErr("Username is already taken!");
    } else {
      setUsernameErr("");
      setFormData((prevFormData) => ({ ...prevFormData, username }));
    }
  }, 500);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    debouncedCheckUsernameUniqueness(value);
  };

  // Debounced to Email API to check if it is unique.
  const debouncedCheckEmailUniqueness = debounceInput(async (emailId) => {
    const isUnique = await checkEmailUniqueness(emailId);
    if (!isUnique) {
      setEmailError("Email is already taken.");
    } else {
      setEmailError("");
      setFormData((prevFormData) => ({ ...prevFormData, emailId }));
    }
  }, 500);

  // Handle email input changes
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailId(value);

    // Validate the email format
    if (!validateEmail(value)) {
      setEmailError("Invalid email format.");
    } else {
      setEmailError(""); // Clear format error if valid

      // Call debounced API check if email format is valid
      debouncedCheckEmailUniqueness(value);
    }
  };

  // Debounced to check Mobile Number API
  const debouncedToCheckMobNum = debounceInput(async (mobileNumber) => {
    const isUniqueMobNum = await checkMobileNumer(mobileNumber);
    if (!isUniqueMobNum) {
      setMobNumErr("Mobile Number is in use!");
    } else {
      setMobNumErr("");
      setFormData((prevFormData) => ({ ...prevFormData, mobileNumber }));
    }
  }, 500);

  //Handle Mobile Number input
  const handleMobileNumber = (e) => {
    const value = e.target.value;
    setMobileNumber(value);

    //validate Mobile Number
    if (!validateMobileNumber(value)) {
      setMobNumErr("Invalid Mobile Number Format!");
    } else {
      setMobNumErr("");

      debouncedToCheckMobNum(value);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update formData for fields other than email
    if (name !== "email") {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debugging formData
    console.log("Submitting form data:", formData);

    // Add API call logic
    const registerationAPIResponse = await registerUser(formData);

    if (registerationAPIResponse === "User Registered Succussfully!") {
      setSuccessMessage(registerationAPIResponse);
      setErrorMessage("");
    } else {
      setErrorMessage(registerationAPIResponse);
      setSuccessMessage("");
    }
    console.log("API Response:", registerationAPIResponse);
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
        <Typography variant="h5" gutterBottom align="center">
          REGISTER YOURSELF
        </Typography>
        <TextField
          required
          label="Enter Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          required
          label="Create Username"
          name="username"
          value={username}
          onChange={handleUsernameChange}
          fullWidth
          margin="normal"
          error={!!usernameErr}
          helperText={usernameErr}
        />
        <TextField
          required
          label="Enter Email ID"
          name="email"
          value={emailId}
          onChange={handleEmailChange}
          fullWidth
          margin="normal"
          error={!!emailError}
          helperText={emailError}
        />

        <TextField
          required
          label="Enter Mobile Number"
          name="mobileNumber"
          value={mobileNumber}
          onChange={handleMobileNumber}
          fullWidth
          margin="normal"
          error={!!mobNumErr}
          helperText={mobNumErr}
        />

        <TextField
          required
          label="Create Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
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
          Create Account
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterForm;
