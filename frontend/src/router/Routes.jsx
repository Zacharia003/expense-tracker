import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LangingPage from "../components/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterForm from "../pages/RegisterForm";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LangingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterForm />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
