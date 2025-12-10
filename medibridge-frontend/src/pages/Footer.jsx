// src/pages/Footer.jsx
import React, { useState } from "react";
import "./styles/Footer.css";

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      {/* TERMS MODAL */}
      {showTerms && (
        <div className="terms-overlay" onClick={() => setShowTerms(false)}>
          <div className="terms-box" onClick={(e) => e.stopPropagation()}>
            <h2>Terms & Conditions</h2>
            <p>
              Welcome to Medibridge. By using our platform, you agree that all information 
              provided is accurate and that you will follow fair usage practices.
            </p>
            <p>
              Medibridge serves as a job-connecting platform only. We do not guarantee 
              job placement. Recruiters are solely responsible for hiring decisions.
            </p>
            <p>
              User data is protected and will not be shared with third parties without 
              consent. Misuse of the platform may lead to account suspension.
            </p>

            <button className="terms-close" onClick={() => setShowTerms(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-left">
          <p>© {new Date().getFullYear()} Medibridge. All rights reserved.</p>

          <p className="footer-dev">
            Developed by <strong>FutuRx</strong> •
            <a href="mailto:futurxteam@gmail.com" className="footer-link">
              futurxteam@gmail.com
            </a>
          </p>

          <p className="footer-small">
            <span className="beta-tag">BETA</span> • Help us improve more →
            <a
              href="mailto:futurxteam@gmail.com?subject=Feedback for Medibridge"
              className="feedback-link"
            >
              Send Feedback
            </a>
          </p>
        </div>

        <div className="footer-right">
          <button className="terms-btn" onClick={() => setShowTerms(true)}>
            Terms & Conditions
          </button>
        </div>
      </footer>
    </>
  );
};

export default Footer;
