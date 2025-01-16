import axios from "axios";
import {
  saveToIndexedDB,
  getToken,
  clearUserData,
} from "../utils/StoreUserDetails";

// Base URL configuration for the API
const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/users", // Base URL of your backend
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Required for cookies or credentials
});

//function to check username uniquness
export const checkUsernameUniqueness = async (username) => {
  try {
    const response = await apiClient.get("/check-username", {
      params: { username },
    });

    return response.data;
  } catch (error) {
    console.error("API error at username API", error);
    return false;
  }
};

// Function to check email uniqueness
export const checkEmailUniqueness = async (email) => {
  try {
    const response = await apiClient.get("/check-email", {
      params: { email }, // Send email as query parameter
    });

    return response.data; // Returns true/false based on backend response
  } catch (error) {
    console.error("Error checking email uniqueness:", error);
    return false; // Return false in case of an error
  }
};

//function to check Mobile Number
export const checkMobileNumer = async (mobNum) => {
  try {
    const response = await apiClient.get("/check-mobileNumber", {
      params: { mobNum }, // send mobile number as query parameter
    });

    return response.data;
  } catch (error) {
    console.error("Error on checking MobileNumber Exist", error);
    return false;
  }
};

export const registerUser = async (user) => {
  try {
    const response = await apiClient.post("/register", user, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.log("Registeration API error: ", error);

    // Handle error responses gracefully
    if (error.response && error.response.data) {
      return (
        error.response.data.message || "An error occurred during registration."
      );
    } else {
      return "Network error. Please try again later.";
    }
  }
};

// Login function using the configured apiClient
export const LoginUser = async (identifier, password) => {
  try {
    const response = await apiClient.post("/login", {
      identifier,
      password,
    });

    // If login is successful, save the token to localStorage
    if (response.data && response.data.token) {
      console.log("Login response", response);
      // localStorage.setItem("token", response.data.token);
      const userData = {
        id: "user", // Use a fixed key for simplicity
        token: response.data.token,
        userId: response.data.userid,
        fullName: response.data.fullName,
        emailId: response.data.emailId,
        mobileNumber: response.data.mobileNumber,
      };
      await saveToIndexedDB(userData);
      return true;
    }

    return false;
  } catch (error) {
    console.log("Login API error: ", error);

    // Handle error responses gracefully
    if (error.response && error.response.data) {
      const errorMessage =
        error.response.data.error || // Custom error message
        error.response.data.message || // Default error message
        "An error occurred during login.";
      throw new Error(errorMessage);
    } else {
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const logout = async () => {
  try {
    const token = await getToken();
    const response = await apiClient.post(
      "/logout",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // Remove the token from localStorage
    // localStorage.removeItem("token");

    if (response.data === "Logout successful") {
      await clearUserData();
      return true;
    } else {
      return false;
    }
    // Remove the token and user data from IndexedDB
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Failed to log out. Please try again.");
  }
};

// Export other user-related API calls if needed in the future
export default {
  checkEmailUniqueness,
  checkMobileNumer,
  checkUsernameUniqueness,
  registerUser,
  LoginUser,
  logout,
};
