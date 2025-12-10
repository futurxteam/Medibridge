// src/pages/Home.jsx
import React, { useEffect } from "react";
import "./styles/Home.css";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/client";

const Home = () => {
  const navigate = useNavigate();
  const { user, token, login, logout } = useAuth();

  const goToDashboard = () => {
    if (!user) return;

    if (user.role === "STUDENT") return navigate("/student/jobs");
    if (user.role === "EXTERNAL") return navigate("/student/jobs");
    if (user.role === "FACULTY") return navigate("/faculty/dashboard");

    return navigate("/");
  };

  const handleLogin = () => {
    if (user) return goToDashboard();
    navigate("/login");
  };

  const handleSignup = () => {
    if (user) return goToDashboard();
    navigate("/signup");
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Restore session
  useEffect(() => {
    if (token && !user) {
      apiRequest("/api/auth/profile")
        .then((profile) => {
          login(
            {
              id: profile._id,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              isMedibridgeStudent: profile.isMedibridgeStudent,
            },
            token
          );
        })
        .catch(() => logout());
    }
  }, [token, user, login, logout]);

  return (
    <div className="page">
      {/* NAVBAR */}
      <header className="nav">
        <div className="nav-left" onClick={() => navigate("/")}>
          <img src="/Medibridge.png" alt="Medibridge logo" className="nav-logo" />
        </div>

        <nav className="nav-links">
          <a href="#students">For Professionals</a>
          <a href="#recruiters">For Recruiters</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <div className="nav-right">
          {!user && (
            <>
              <button className="nav-link-btn" onClick={handleLogin}>
                Login
              </button>
              <button className="nav-cta" onClick={handleSignup}>
                Get started
              </button>
            </>
          )}

          {user && (
            <div className="nav-user-chip">
              <span className="nav-user-text">
                Hello, <span className="nav-user-name">{user.name}</span>
              </span>

              <button className="nav-link-btn" onClick={handleLogout}>
                Logout
              </button>

              <button
                className="nav-cta"
                onClick={() => {
                  if (user.role === "STUDENT") navigate("/student/jobs");
                  else if (user.role === "EXTERNAL") navigate("/student/jobs");
                  else if (user.role === "FACULTY") navigate("/faculty/dashboard");
                }}
              >
                Dashboard
              </button>
            </div>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="hero">
        <div className="hero-left">
          <div className="hero-pill">Healthcare Professional Career Platform • Medibridge</div>

          <h1 className="hero-title">
            Connecting skilled candidates
            <br />
            with <span className="gradient-text">verified opportunities</span>.
          </h1>

          <p className="hero-subtitle">
            Medibridge brings medical professionals and recruiters into a unified hiring ecosystem.
            Explore roles tailored to your qualifications and background.
          </p>

          <div className="hero-actions">
            <button className="hero-primary" onClick={handleLogin}>
              {user ? "Go to Dashboard" : "Join us to explore opportunities"}
            </button>
          </div>

          <div className="hero-metadata">
            <span>🔒 Secure account-based access</span>
            <span>•</span>
            <span>🎓 Trusted by institutions & organisations</span>
          </div>
        </div>

        {/* DASHBOARD PREVIEW */}
        <div className="hero-right">
          <div className="dashboard-card">
            <div className="dashboard-header">
              <span>Job overview</span>
              <span className="badge">Live</span>
            </div>

            <div className="dashboard-metrics">
              <div className="metric">
                <span className="metric-label">Open roles</span>
                <span className="metric-value">128</span>
                <span className="metric-sub">Updated regularly</span>
              </div>
              <div className="metric">
                <span className="metric-label">Placed</span>
                <span className="metric-value accent">32</span>
                <span className="metric-sub"></span>
              </div>
            </div>

            {/* UPDATED PREVIEW LIST WITHOUT REAL COMPANIES */}
            <div className="dashboard-list">
              <div className="list-row list-header">
                <span>Company</span>
                <span>Role</span>
                <span>Type</span>
                <span>Status</span>
              </div>

              <div className="list-row">
                <span>Healthcare Group A </span>
                <span> - Assistant Lab Technician </span>
                <span>- Exclusive</span>
                <span className="pill pill-purple">Priority</span>
              </div>

              <div className="list-row">
                <span>Medical Center B </span>
                <span>- Clinical Intern </span>
                <span>Open</span>
                <span className="pill pill-green">Open</span>
              </div>

              <div className="list-row">
                <span>Hospital Network C</span>
                <span>- Pharma Associate</span>
                <span>- Exclusive</span>
                <span className="pill pill-yellow">Shortlisting</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* STUDENT SECTION */}
      <section id="students" className="section section-grid">
        <div className="section-text">
          <h2>Empowering every candidate.</h2>
          <p>Create your verified profile and access job opportunities aligned with your expertise.</p>
        </div>
        <div className="section-cards">
          <div className="mini-card">
            <h3>Wide range of roles</h3>
            <p>
              Explore verified openings across healthcare organisations, biotech, and medical institutions.
            </p>
          </div>
        </div>
      </section>

      {/* RECRUITERS SECTION */}
      <section id="recruiters" className="section section-grid reverse">
        <div className="section-text">
          <h2>Built for recruiters & institutions.</h2>
          <p>
            Post openings, review applicants, and streamline your hiring process with role-based filters.
          </p>
        </div>
        <div className="section-cards">
          <div className="mini-card">
            <h3>Targeted hiring</h3>
            <p>
              Restrict specialised jobs to verified candidates while keeping general roles open to all.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section steps">
        <h2>How Medibridge works</h2>

        <div className="steps-grid">
          <div className="step">
            <span className="step-number">1</span>
            <h3>Create your account</h3>
            <p>Sign up and verify your identity to access role-based job listings.</p>
          </div>

          <div className="step">
            <span className="step-number">2</span>
            <h3>Discover roles</h3>
            <p>Browse curated opportunities based on your background and eligibility.</p>
          </div>

          <div className="step">
            <span className="step-number">3</span>
            <h3>Apply & track</h3>
            <p>Submit applications and track your progress as recruiters review them.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="pricing" className="section final-cta">
        <div>
          <h2>Ready to start your journey?</h2>
          <p>Join Medibridge and experience a modern, seamless recruitment workflow.</p>
        </div>

        <div className="cta-buttons">
          <button className="hero-primary" onClick={handleSignup}>
            {user ? "Dashboard" : "Get started"}
          </button>

          <button
            className="hero-secondary"
            onClick={() => window.open("mailto:futerexxteam@gmail.com")}
          >
            Contact Admin
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
