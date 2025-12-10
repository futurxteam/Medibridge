// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";
import { register, sendOtp, verifyOtp } from "../api/api";

const Signup = () => {
  const navigate = useNavigate();

  // STATE
  const [referralCode, setReferralCode] = useState("");
  const [showReferralInfo, setShowReferralInfo] = useState(false);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [otpSuccessEffect, setOtpSuccessEffect] = useState(false);
  const [signupSuccessEffect, setSignupSuccessEffect] = useState(false);

  // SEND OTP
  const handleSendOtp = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setSendingOtp(true);

    if (!email) {
      setSendingOtp(false);
      return setErrorMsg("Please enter email first.");
    }

    const res = await sendOtp(email);
    if (!res.success) {
      setSendingOtp(false);
      return setErrorMsg(res.error || "Failed to send OTP.");
    }

    setOtpSent(true);
    setSuccessMsg("OTP sent to your email!");
    setSendingOtp(false);
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setVerifyingOtp(true);

    if (!otp) {
      setVerifyingOtp(false);
      return setErrorMsg("Enter the OTP you received.");
    }

    const res = await verifyOtp(email, otp);

    if (!res.success) {
      setVerifyingOtp(false);
      return setErrorMsg(res.error || "Incorrect OTP.");
    }

    setOtpSuccessEffect(true);
    setTimeout(() => setOtpSuccessEffect(false), 1000);

    setOtpVerified(true);
    setSuccessMsg("OTP verified successfully!");
    setVerifyingOtp(false);
  };

  // FINAL SIGNUP
  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMsg("");
  setSuccessMsg("");

  if (!otpVerified) {
    setErrorMsg("Please verify OTP first.");
    setTimeout(() => setErrorMsg(""), 3000);
    return;
  }

  if (!acceptedTerms) {
    setErrorMsg("You must accept Terms & Conditions.");
    setTimeout(() => setErrorMsg(""), 3000);
    return;
  }

    setLoading(true);

    const body = {
      name,
      email,
      password,
      role: "EXTERNAL",
      referralCode: referralCode || null,
    };

    const { success, data, error } = await register(body);

    if (!success) {
      setLoading(false);
      return setErrorMsg(error);
    }

    setSignupSuccessEffect(true);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setTimeout(() => navigate("/login"), 600);
  };

  return (
    <div className="auth-page">
      {/* TERMS & CONDITIONS POPUP */}
      {showTermsModal && (
        <div className="terms-overlay">
          <div className="terms-box">
            <h2>Medibridge — Terms & Conditions</h2>

            <p>1. Information provided must be accurate and truthful.</p>
            <p>2. Your CV & profile may be shared with verified recruiters.</p>
            <p>3. Medibridge does not guarantee interviews or job placements.</p>
            <p>4. Medibridge is not responsible for employer behaviour or disputes.</p>
            <p>5. Users must not upload fake data, spam, or misuse the platform.</p>
            <p>6. All platform content belongs to Medibridge.</p>
            <p>7. Legal jurisdiction: Kerala, India.</p>

            <button className="terms-close" onClick={() => setShowTermsModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* REFERRAL INFO POPUP */}
      {showReferralInfo && (
        <div className="terms-overlay">
          <div className="terms-box">
            <h2>What is a Referral Code?</h2>
            <p>
              Referral codes are awarded by Medibridge to candidates based on:
            </p>
            <p>• Performance in Medibridge talent assessments</p>
            <p>• Behaviour, professionalism & community participation</p>
            <p>• Special events, workshops & merit-based recognitions</p>

            <p>
              These codes help job seekers stand out and may unlock exclusive
              opportunities.
            </p>

            <button className="terms-close" onClick={() => setShowReferralInfo(false)}>
              Got it
            </button>
          </div>
        </div>
      )}

      {/* SIGNUP CARD */}
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-sub">Join Medibridge today</p>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <div className="auth-group">
            <label className="auth-label">Full Name *</label>
            <input
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* EMAIL + OTP */}
          <div className="auth-group">
            <label className="auth-label">Email *</label>
            <div className="otp-row">
              <input
                className="auth-input"
                type="email"
                value={email}
                disabled={otpSent && !otpVerified}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setOtpSent(false);
                  setOtpVerified(false);
                }}
                required
              />
              <br/> <br/>
                <button type="button" className="otp-btn" onClick={handleSendOtp}>
                {sendingOtp ? <span className="loading-spinner" /> : otpSent ? "Resend" : "Send OTP"}
              </button>
            </div>
          </div>

          {/* OTP INPUT */}
          {otpSent && (
            <div className="auth-group">
              <label className="auth-label">Enter OTP *</label>
              <div className="otp-row">
                <input
                  className={`auth-input ${otpSuccessEffect ? "success-glow" : ""}`}
                  disabled={otpVerified}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <br/> <br/>
                <button type="button" className="otp-btn" onClick={handleVerifyOtp}>
                  {verifyingOtp ? <span className="loading-spinner" /> : "Verify"}
                </button>
              </div>
            </div>
          )}

          {/* REFERRAL CODE + TOOLTIP */}
          <div className="auth-group">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <label className="auth-label">Referral Code</label>
              <span
                style={{
                  background: "#2563eb",
                  color: "white",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={() => setShowReferralInfo(true)}
              >
              {" "}
  !
              </span>
            </div>
<br/> 
            <input
              className="auth-input"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="auth-group">
            <label className="auth-label">Password *</label>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* TERMS CHECKBOX */}
          <div className="auth-group" style={{ marginTop: "15px" }}>
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <span>
              {" "}
  I agree to the{" "}
                <span
                  className="auth-link"
                  onClick={() => setShowTermsModal(true)}
                >
                  Terms & Conditions
                </span>
              </span>
            </label>
          </div>

          {/* ERROR */}
         {/* ERROR */}
{/* ERROR */}
{errorMsg && (
  <div className="error-box">
    {errorMsg}
  </div>
)}

{/* SUCCESS */}
{successMsg && (
  <div className="success-box">
    {successMsg}
  </div>
)}

          {/* SUBMIT */}
          <button
            className={`auth-btn ${signupSuccessEffect ? "success-glow" : ""}`}
            type="submit"
           disabled={loading} 
          >
            {loading ? <span className="loading-spinner" /> : "Sign Up"}
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
