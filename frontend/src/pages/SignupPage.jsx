import React, { useState, useEffect, useCallback } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import {
  checkUsernameUniqueness,
  checkEmailUniqueness,
  checkMobileNumer,
  registerUser,
} from "../api/userApi";
import validateEmail from "../utils/validateEmail";
import debounceInput from "../utils/debounceInput";
import { checkPasswordStrength } from "../utils/CheckPasswordStrength";
import validateMobileNumber from "../utils/validateMobileNumber";
import { Link, useNavigate } from "react-router-dom";

const getColorBasedOnStrength = (strength) => {
  switch (strength) {
    case "Very strong password!":
    case "Strong password!":
      return "green";
    case "Medium password!":
      return "yellow";
    case "Weak password!":
    case "Very weak password!":
      return "red";
    default:
      return "black";
  }
};

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    emailId: "",
    mobileNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    emailId: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isSignupDisabled, setIsSignupDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Validate form completeness and validity
  const validateForm = useCallback(() => {
    const isFormValid =
      formData.fullName &&
      !errors.username &&
      !errors.emailId &&
      !errors.mobileNumber &&
      !errors.password &&
      confirmPassword &&
      confirmPassword === formData.password;

    setIsSignupDisabled(!isFormValid);
  }, [formData, errors, confirmPassword]);

  // Trigger validation whenever errors or form data change
  useEffect(() => {
    validateForm();
  }, [validateForm, errors, formData, confirmPassword]);

  // Debounced API call to check username uniqueness
  const debouncedCheckUsernameUniqueness = debounceInput(async (username) => {
    const isUnique = await checkUsernameUniqueness(username);
    setErrors((prev) => ({
      ...prev,
      username: isUnique ? "" : "Username is already taken!",
    }));
  }, 500);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, username: value }));
    debouncedCheckUsernameUniqueness(value);
  };

  // Debounced API call to check email uniqueness
  const debouncedCheckEmailUniqueness = debounceInput(async (emailId) => {
    const isUnique = await checkEmailUniqueness(emailId);
    setErrors((prev) => ({
      ...prev,
      emailId: isUnique ? "" : "Email is already taken!",
    }));
  }, 500);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, emailId: value }));
    if (!validateEmail(value)) {
      setErrors((prev) => ({ ...prev, emailId: "Invalid email format." }));
    } else {
      setErrors((prev) => ({ ...prev, emailId: "" }));
      debouncedCheckEmailUniqueness(value);
    }
  };

  // Debounced API call to check mobile number uniqueness
  const debouncedCheckMobileNumber = debounceInput(async (mobileNumber) => {
    const isUnique = await checkMobileNumer(mobileNumber);
    setErrors((prev) => ({
      ...prev,
      mobileNumber: isUnique ? "" : "Mobile Number is already in use!",
    }));
  }, 500);

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, mobileNumber: value }));
    if (!validateMobileNumber(value)) {
      setErrors((prev) => ({
        ...prev,
        mobileNumber: "Invalid Mobile Number Format!",
      }));
    } else {
      setErrors((prev) => ({ ...prev, mobileNumber: "" }));
      debouncedCheckMobileNumber(value);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, password: value }));
    setPasswordStrength(checkPasswordStrength(value));
    setErrors((prev) => ({
      ...prev,
      password:
        value.length < 8 ? "Password must be at least 8 characters!" : "",
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors((prev) => ({
      ...prev,
      confirmPassword:
        value === formData.password ? "" : "Passwords do not match",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { confirmPassword, ...dataToSend } = formData;
    const response = await registerUser(dataToSend);
    if (response === "User Registered Succussfully!") {
      setErrorMessage(""); // Clear any previous errors
      navigate("/login");
    } else {
      setErrorMessage("Failed to register!");
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
          width: "400px",
          padding: "20px",
          boxShadow: 3,
          borderRadius: "8px",
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Create Account
        </Typography>
        <TextField
          required
          label="Your Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, fullName: e.target.value }))
          }
          fullWidth
          margin="normal"
        />
        <TextField
          required
          label="Create Username"
          name="username"
          value={formData.username}
          onChange={handleUsernameChange}
          fullWidth
          margin="normal"
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          required
          label="Your Email ID"
          name="emailId"
          value={formData.emailId}
          onChange={handleEmailChange}
          fullWidth
          margin="normal"
          error={!!errors.emailId}
          helperText={errors.emailId}
        />
        <TextField
          required
          label="Your Mobile Number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleMobileNumberChange}
          fullWidth
          margin="normal"
          error={!!errors.mobileNumber}
          helperText={errors.mobileNumber}
        />
        <TextField
          required
          label="Create Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
        />
        <Typography
          style={{ color: getColorBasedOnStrength(passwordStrength) }}
        >
          {passwordStrength}
        </Typography>
        <TextField
          required
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          fullWidth
          margin="normal"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSignupDisabled}
          sx={{ mt: 2, display: "block", mx: "auto" }}
        >
          Create Account
        </Button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <p style={{ textAlign: "center" }}>
          Already have account?
          <Link to="/login" style={{ marginLeft: "6px" }}>
            Login
          </Link>
        </p>
      </Box>
    </Box>
  );
};

export default SignupPage;
