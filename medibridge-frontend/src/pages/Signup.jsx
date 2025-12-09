// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";
import { register, sendOtp, verifyOtp } from "../api/api";

const Signup = () => {
  const navigate = useNavigate();
useEffect(() => {
  if (successMsg) {
    setTimeout(() => {
      navigate("/login");
    }, 1500); // 1.5s delay
  }
}, [successMsg]);
  // NEW: Student type selector
  const [studentType, setStudentType] = useState("ACADEMY"); 
  // ACADEMY or EXTERNAL

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");

  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /*====================================================
    SEND OTP
  ====================================================*/
  const handleSendOtp = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!email) return setErrorMsg("Please enter email first");

    const res = await sendOtp(email);
    if (!res.success) return setErrorMsg(res.error || "Failed to send OTP");

    setOtpSent(true);
    setSuccessMsg("OTP sent to your email!");
  };

  /*====================================================
    VERIFY OTP
  ====================================================*/
  const handleVerifyOtp = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!otp) return setErrorMsg("Enter the OTP you received");

    const res = await verifyOtp(email, otp);
    if (!res.success) return setErrorMsg(res.error || "Incorrect OTP");

    setOtpVerified(true);
    setSuccessMsg("OTP verified! You can now create your account.");
  };

  /*====================================================
    CREATE ACCOUNT
  ====================================================*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");

    if (!otpVerified) {
      return setErrorMsg("Please verify OTP first.");
    }

    // Determine backend role
    const role = studentType === "ACADEMY" ? "STUDENT" : "EXTERNAL";

    // Validate admission number only for academy
    if (studentType === "ACADEMY" && !admissionNo) {
      return setErrorMsg("Admission number is required for academy students.");
    }

    setLoading(true);

    try {
      const body = {
        name,
        email,
        password,
        role,
        admissionNo: studentType === "ACADEMY" ? admissionNo : null,
      };

      const { success, data, error } = await register(body);

      if (!success) {
  console.log("Signup error:", error);  // DEBUG — shows exactly what you're receiving
  return setErrorMsg(error);
}


      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setErrorMsg("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-sub">Join Medibridge today</p>

        <form onSubmit={handleSubmit}>
          {/* SELECT STUDENT TYPE */}
          <div className="auth-group">
            <label className="auth-label">I am a:</label>
            <select
              className="auth-input"
              value={studentType}
              onChange={(e) => setStudentType(e.target.value)}
            >
              <option value="ACADEMY">FutureAce Academy Student</option>
              <option value="EXTERNAL">External Student</option>
            </select>
          </div>

          {/* NAME */}
          <div className="auth-group">
            <label className="auth-label">Full Name</label>
            <input
              className="auth-input"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* ACADEMY STUDENTS → ADMISSION NO */}
          {studentType === "ACADEMY" && (
            <div className="auth-group">
              <label className="auth-label">Admission Number</label>
              <input
                className="auth-input"
                type="text"
                placeholder="e.g. FA-2024-00123"
                value={admissionNo}
                onChange={(e) => setAdmissionNo(e.target.value)}
                required
              />
            </div>
          )}

          {/* EMAIL + OTP BUTTON */}
          <div className="auth-group">
            <label className="auth-label">Email</label>
            <div className="otp-row">
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setOtpSent(false);
                  setOtpVerified(false);
                }}
                required
              />
              <button type="button" className="otp-btn" onClick={handleSendOtp}>
                {otpSent ? "Resend" : "Send OTP"}
              </button>
            </div>
          </div>

          {/* OTP FIELD */}
          {otpSent && (
            <div className="auth-group">
              <label className="auth-label">Enter OTP</label>
              <div className="otp-row">
                <input
                  className="auth-input"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  type="button"
                  className="otp-btn"
                  onClick={handleVerifyOtp}
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {/* PASSWORD */}
          <div className="auth-group">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          {/* FEEDBACK MESSAGES */}
          {successMsg && <p className="auth-success">{successMsg} </p>}

{errorMsg && (
  <div style={{
    background: "#ffdddd",
    padding: "12px",
    color: "#b30000",
    borderRadius: "6px",
    marginTop: "10px",
    fontSize: "15px",
    fontWeight: "500",
    border: "1px solid #ffb3b3"
  }}>
    {errorMsg}
  </div>
)}

          {/* REGISTER BUTTON */}
          <button
            className="auth-btn"
            type="submit"
            disabled={loading || !otpVerified}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>
            Log in here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
