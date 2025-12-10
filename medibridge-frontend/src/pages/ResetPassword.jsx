import { useState } from "react";
import { forgotPasswordSendOtp, forgotPasswordVerifyOtp, resetPassword } from "../api/api";
import "./styles/Login.css";

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // STEP 1 — SEND OTP
  const handleEmailSubmit = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await forgotPasswordSendOtp(email);

    if (!res.success) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg("OTP sent to your email.");
      setTimeout(() => setStep(2), 800);
    }

    setLoading(false);
  };

  // STEP 2 — VERIFY OTP
  const handleOtpVerify = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await forgotPasswordVerifyOtp(email, otp);

    if (!res.success) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg("OTP verified!");
      setTimeout(() => setStep(3), 600);
    }

    setLoading(false);
  };

  // STEP 3 — RESET PASSWORD
  const handlePasswordReset = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await resetPassword(email, newPassword);

    if (!res.success) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg("Password changed successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 800);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>

        {/* ERROR & SUCCESS */}
        {errorMsg && <p className="auth-error">{errorMsg}</p>}
        {successMsg && <p className="auth-success">{successMsg}</p>}

        {/* STEP 1 — EMAIL */}
        {step === 1 && (
          <div>
            <p className="auth-sub">Enter your registered email</p>

            <input
              type="email"
              className="auth-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className="auth-btn" onClick={handleEmailSubmit}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 — OTP */}
        {step === 2 && (
          <div>
            <p className="auth-sub">Enter the OTP sent to your email</p>

            <input
              className="auth-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button className="auth-btn" onClick={handleOtpVerify}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <p
              className="auth-link"
              style={{ marginTop: "10px" }}
              onClick={() => setStep(1)}
            >
              Change email
            </p>
          </div>
        )}

        {/* STEP 3 — NEW PASSWORD */}
        {step === 3 && (
          <div>
            <p className="auth-sub">Enter your new password</p>

            <input
              type="password"
              className="auth-input"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button className="auth-btn" onClick={handlePasswordReset}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
