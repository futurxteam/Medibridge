// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";        // homepage
import Login from "./pages/login";      // login file
import Signup from "./pages/Signup";    // signup file
import FacultyLogin from "./pages/FacultyLogin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/faculty-login" element={<FacultyLogin />} />
    </Routes>
  );
}
