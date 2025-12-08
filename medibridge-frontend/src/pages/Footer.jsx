// src/pages/Footer.jsx
import React from "react";
import { useNavigate } from "react-router-dom";



const Footer = () => {
  const navigate = useNavigate();

 const handleFacultyLogin = () => navigate("/faculty-login");


  return (
    <footer className="footer-wrapper">
      <div className="footer-main">
        <span>© {new Date().getFullYear()} Medibridge.</span>
        <span className="dot">•</span>
        <span>Student-first job recruitment platform.</span>
      </div>

      <div className="footer-admin">
  <span>Login as faculty?</span>
  <button className="footer-admin-btn" onClick={handleFacultyLogin}>
    Faculty Login
  </button>
</div>

    </footer>
  );
};


export default Footer;
