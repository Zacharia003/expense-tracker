import axios from "axios";

// Base URL configuration for the API
const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/users", // Base URL of your backend
  headers: {
    "Content-Type": "application/json",
  },
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

// Export other user-related API calls if needed in the future
export default {
  checkEmailUniqueness,
  checkMobileNumer,
  checkUsernameUniqueness,
  registerUser,
};
