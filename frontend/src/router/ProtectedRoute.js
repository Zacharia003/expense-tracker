import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  // if (isAuthenticated === null) {
  //   return <div>Loading...</div>; // Optional: Show a loading spinner
  // }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
