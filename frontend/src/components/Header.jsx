import React, { useState, useEffect, useContext } from "react";
import { Button, Stack } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/LandgingPage.css";
import { logout } from "../api/userApi";
import checkLoginStatus from "../router/checkLoginStatus";
import { AuthContext } from "../router/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated } = useContext(AuthContext);

  const [isLoggedIn, setIsLoggedIn] = useState(checkLoginStatus());

  useEffect(() => {
    const checkAuthStatus = async () => {
      const status = await checkLoginStatus();
      setIsLoggedIn(status);
    };
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const isLoggedOut = await logout(); // Call the logout function

      console.log("isLoggedOut", isLoggedOut);
      if (isLoggedOut) {
        setIsAuthenticated(false); // Update authentication state
        navigate("/"); // Redirect to Landing page
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="header">
      {isLoggedIn ? (
        <a className="logo" onClick={() => navigate("/dashboard")}>
          {" "}
          Expense Tracker{" "}
        </a>
      ) : (
        <a className="logo" onClick={() => navigate("/")}>
          {" "}
          Expense Tracker{" "}
        </a>
      )}

      <Stack direction="row" spacing={2}>
        {isLoggedIn ? (
          <Button
            className="logout-btn"
            variant="contained"
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <>
            {location.pathname !== "/login" && (
              <Button
                className="nav-btn"
                variant="contained"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}
            {location.pathname !== "/signup" && (
              <Button
                className="nav-btn"
                variant="contained"
                onClick={() => navigate("/signup")}
              >
                Signup
              </Button>
            )}
          </>
        )}
      </Stack>
    </header>
  );
};

export default Header;
