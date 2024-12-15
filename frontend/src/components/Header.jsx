import React from "react";
import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import "../styles/LandgingPage.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Expense Tracker</div>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" component={Link} to="/login">
          Login
        </Button>
        <Button variant="contained" component={Link} to="/signup">
          Signup
        </Button>
      </Stack>
    </header>
  );
};

export default Header;
