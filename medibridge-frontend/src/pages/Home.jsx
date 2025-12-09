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

  const handleLogin = () => {
    // If already logged in, send them to the right place
    if (user) {
      if (user.role === "STUDENT") return navigate("/student/jobs");
      if (user.role === "EXTERNAL") return navigate("/external/jobs");
      if (user.role === "FACULTY") return navigate("/faculty/dashboard");
      return navigate("/");
    }
    // Otherwise go to login page
    navigate("/login");
  };
 const handlesignup = () => {
    navigate("/signup");
  };
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // On first load / refresh: if we have a token but no user in context,
  // fetch profile from backend to restore the session.
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
        .catch(() => {
          // Token invalid/expired → clear it
          logout();
        });
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
          <a href="#students">For students</a>
          <a href="#recruiters">For recruiters</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <div className="nav-right">
          {!user && (
            <>
              <button className="nav-link-btn" onClick={handleLogin}>
                Login
              </button>
              <button className="nav-cta" onClick={handlesignup}>
                Get started
              </button>
            </>
          )}

          {user && (
            <div className="nav-user-chip">
              <div className="nav-user-text">
                <span>
                  Hello,{" "}
                  <span className="nav-user-name">{user.name}</span>{" "}
                  <span className="nav-user-role">({user.role})</span>
                </span>
                <button
                  type="button"
                  className="nav-dashboard-link"
                  onClick={() => {
                    if (user.role === "STUDENT") navigate("/student/jobs");
                    else if (user.role === "EXTERNAL")
                      navigate("/student/jobs");
                    else if (user.role === "FACULTY")
                      navigate("/faculty/dashboard");
                    else navigate("/");
                  }}
                >
                  Go to dashboard
                </button>
              </div>

              <button className="nav-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <main className="hero">
        <div className="hero-left">
          <div className="hero-pill">Student job platform • Medibridge</div>

          <h1 className="hero-title">
            The recruitment platform
            <br />
            for <span className="gradient-text">Medibridge students</span>.
          </h1>

          <p className="hero-subtitle">
            Medibridge connects verified students with curated roles from
            trusted recruiters. Login with your student ID to see every job
            you’re eligible for – including exclusive openings only for
            Medibridge students.
          </p>

          <div className="hero-actions">
            <button className="hero-primary" onClick={handleLogin}>
              Student login
            </button>
            <button className="hero-secondary" onClick={handleLogin}>
              External Candidates Login
            </button>
          </div>

          <div className="hero-metadata">
            <span>🔒 Secure ID-based access</span>
            <span>•</span>
            <span>🎓 Built for campus placements</span>
          </div>
        </div>

        {/* “DASHBOARD” PREVIEW CARD */}
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
                <span className="metric-sub">Updated in real time</span>
              </div>
              <div className="metric">
                <span className="metric-label">Medibridge-only</span>
                <span className="metric-value accent">32</span>
                <span className="metric-sub">Visible only to you</span>
              </div>
            </div>

            <div className="dashboard-list">
              <div className="list-row list-header">
                <span>Company</span>
                <span>Role</span>
                <span>Type</span>
                <span>Status</span>
              </div>

              <div className="list-row">
                <span>Nova Health</span>
                <span>Junior Data Analyst</span>
                <span>Medibridge only</span>
                <span className="pill pill-purple">Priority</span>
              </div>

              <div className="list-row">
                <span>CareBridge</span>
                <span>Clinical Ops Intern</span>
                <span>Open to all</span>
                <span className="pill pill-green">Open</span>
              </div>

              <div className="list-row">
                <span>Wellnest</span>
                <span>Product Associate</span>
                <span>Medibridge only</span>
                <span className="pill pill-yellow">Shortlisting</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* SECTIONS */}
      <section id="students" className="section section-grid">
        <div className="section-text">
          <h2>Designed for students first.</h2>
          <p>
            Log in using your student ID card, view every public job on the
            platform, and unlock additional listings reserved only for
            Medibridge students.
          </p>
        </div>
        <div className="section-cards">
          <div className="mini-card">
            <h3>Jobs for everyone</h3>
            <p>
              Browse internships and full-time roles that any registered
              candidate can apply to.
            </p>
          </div>
          <div className="mini-card">
            <h3>Medibridge-exclusive roles</h3>
            <p>
              Access high-quality positions that are visible only after your
              Medibridge student status is verified.
            </p>
          </div>
        </div>
      </section>

      <section id="recruiters" className="section section-grid reverse">
        <div className="section-text">
          <h2>Built for recruiters & admins.</h2>
          <p>
            Post openings, mark them as public or Medibridge-only, and track
            applications from a single dashboard.
          </p>
        </div>
        <div className="section-cards">
          <div className="mini-card">
            <h3>Target the right students</h3>
            <p>
              Restrict specialised roles to Medibridge students while keeping
              general roles open to everyone.
            </p>
          </div>
          <div className="mini-card">
            <h3>Admin-level control</h3>
            <p>
              College admins approve recruiters, manage visibility, and monitor
              placement activity from one place.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section steps">
        <h2>How Medibridge works</h2>
        <div className="steps-grid">
          <div className="step">
            <span className="step-number">1</span>
            <h3>Log in securely</h3>
            <p>
              Students sign in using their ID credentials. Recruiters and admins
              use verified accounts.
            </p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <h3>See your jobs</h3>
            <p>
              Everyone sees public roles. Medibridge students also see exclusive
              jobs assigned only to them.
            </p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <h3>Apply & track</h3>
            <p>
              Apply in a click and track status as recruiters shortlist,
              interview and select candidates.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="section final-cta">
        <div>
          <h2>Ready to launch your student job portal?</h2>
          <p>
            Integrate Medibridge with your campus and give students a modern
            recruitment experience.
          </p>
        </div>
        <div className="cta-buttons">
          <button className="hero-primary" onClick={handleLogin}>
            Get started
          </button>
          <button className="hero-secondary" onClick={handleLogin}>
            Talk to admin
          </button>
        </div>
      </section>

      {/* FOOTER COMPONENT */}
      <Footer />
    </div>
  );
};

export default Home;
