import axios from "axios";
import { getToken } from "../utils/StoreUserDetails";

// Base URL configuration for the API
const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/expense-buckets", // Base URL of your backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an Axios interceptor to include the token
apiClient.interceptors.request.use(
  async (config) => {
    // const token = localStorage.getItem("token");
    const token = await getToken();
    // console.log(
    //   "Authorization Header:",
    //   token ? `Bearer ${token}` : "No Token"
    // );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//fetch Expense Bucket via API function
export const getExpenseBucketList = async (id) => {
  try {
    console.log("Id for expenseDetails", id);
    const response = await apiClient.get(`/getAllExpeseBuckets/${id}`);

    // Assuming response.data is {status, message, data}
    if (response.data.status === "200") {
      return response.data.data; // Return the list of buckets
    } else {
      console.warn(response.data.message);
      return []; // Return an empty array if no data is found
    }
  } catch (error) {
    console.error("Error fetching expense buckets:", error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message ||
          "An error occurred during fetching Expense Buckets."
      );
    } else {
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const SaveNewExpenseBucket = async (
  bucketName,
  description,
  tag,
  userId
) => {
  try {
    const response = await apiClient.post("/addNewBucket", {
      bucketName,
      description,
      tag,
      userId,
    });

    return response.data;
  } catch (error) {
    console.log("SaveNewExpenseBucket API error: ", error);
    // Handle error responses gracefully
    if (error.response && error.response.data) {
      return {
        status: error.response.status,
        message:
          error.response.data.message ||
          "An error occurred during adding new Expense.",
      };
    } else {
      return {
        status: 500,
        message: "Network error. Please try again later.",
      };
    }
  }
};

export const DeleteExpenseBucket = async (id) => {
  try {
    const response = await apiClient.delete("/deleteBucket", {
      params: { id },
    });

    return response.data;
  } catch (error) {
    console.log("DeleteExpenseBucket API error: ", error);
    if (error.response && error.response.data) {
      return {
        status: error.response.status,
        message:
          error.response.data.message || "An error occurred during deletion.",
      };
    } else {
      return {
        status: 500,
        message: "Network error. Please try again later.",
      };
    }
  }
};

export const UpdateExpenseBucket = async (id, userId, payload) => {
  try {
    const response = await apiClient.patch(
      `/updateExpBucketDetails/${id}`,
      payload,
      {
        params: { userId }, // Ensure userId is properly passed
      }
    );
    return response.data;
  } catch (error) {
    console.log("UpdateExpenseBucket API error: ", error);
    // Handle error responses gracefully
    if (error.response && error.response.data) {
      return {
        status: error.response.status,
        message:
          error.response.data.message ||
          "An error occurred during adding updating Expense Bucket Details.",
      };
    } else {
      return {
        status: 500,
        message: "Network error. Please try again later.",
      };
    }
  }
};

export default {
  getExpenseBucketList,
  SaveNewExpenseBucket,
  DeleteExpenseBucket,
  UpdateExpenseBucket,
};
