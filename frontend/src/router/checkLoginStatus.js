import { jwtDecode } from "jwt-decode";
import { getToken } from "../utils/StoreUserDetails";

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now(); // Check expiration
  } catch (error) {
    return false;
  }
};

const checkLoginStatus = async () => {
  // const token = localStorage.getItem("token");
  const token = await getToken();

  return token && isTokenValid(token);
};

export default checkLoginStatus;
