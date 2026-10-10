import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

const SEASONS = ["Spring", "Summer", "Monsoon", "Autumn", "Winter"]

// Three steps: 1) enter email  2) answer season  3) set new password
function ForgotPassword() {
  const [step,       setStep]       = useState(1)   // 1 | 2 | 3
  const [email,      setEmail]      = useState("")
  const [season,     setSeason]     = useState("")
  const [resetToken, setResetToken] = useState("")
  const [newPass,    setNewPass]    = useState("")
  const [confirm,    setConfirm]    = useState("")
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState("")
  const [success,    setSuccess]    = useState(false)
  const navigate = useNavigate()

  // Step 1 → 2: verify email exists (just move to step 2)
  const goToSeason = () => {
    if (!email) { setError("Please enter your email."); return }
    setError("")
    setStep(2)
  }

  // Step 2 → 3: verify season answer
  const verifySeason = async () => {
    if (!season) { setError("Please select your favourite season."); return }
    setLoading(true)
    setError("")
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-season", {
        email,
        favouriteSeason: season
      })
      setResetToken(res.data.resetToken)
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.")
    } finally {
      setLoading(false)
    }
  }

  // Step 3: reset password
  const resetPassword = async () => {
    if (!newPass) { setError("Please enter a new password."); return }
    if (newPass !== confirm) { setError("Passwords do not match."); return }
    if (newPass.length < 6) { setError("Password must be at least 6 characters."); return }
    setLoading(true)
    setError("")
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        resetToken,
        newPassword: newPass
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Please start again.")
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ───────────────────────────────
  if (success) return (
    <div className="auth-wrap">
      <div className="auth-card anim" style={{ textAlign:"center" }}>
        <div style={{ fontSize:"3rem", marginBottom:12 }}>✅</div>
        <h2 style={{ marginBottom:8 }}>Password Reset!</h2>
        <p className="sub">Your new password has been saved. You can now log in.</p>
        <button className="btn btn-green btn-full btn-lg mt-24" onClick={() => navigate("/login")}>
          Go to Login →
        </button>
      </div>
    </div>
  )

  return (
    <div className="auth-wrap">
      <div className="auth-card anim">
        <div style={{ textAlign:"center", fontSize:"2.5rem", marginBottom:8 }}>🔐</div>
        <h2 style={{ textAlign:"center" }}>Forgot Password</h2>

        {/* Step indicator */}
        <div style={{ display:"flex", gap:6, justifyContent:"center", margin:"12px 0 20px" }}>
          {[1,2,3].map(n => (
            <div key={n} style={{
              width: 28, height: 28, borderRadius:"50%",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:".78rem", fontWeight:700,
              background: step >= n ? "var(--g)" : "var(--border-strong)",
              color: step >= n ? "#fff" : "var(--ink-soft)",
              transition:"all .2s"
            }}>{n}</div>
          ))}
        </div>

        {error && <div className="alert alert-red">{error}</div>}

        {/* ── Step 1: Email ── */}
        {step === 1 && (
          <>
            <p className="sub" style={{ textAlign:"center" }}>
              Enter the email address linked to your account.
            </p>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && goToSeason()}
              />
            </div>
            <button className="btn btn-green btn-full btn-lg mt-8" onClick={goToSeason}>
              Continue →
            </button>
          </>
        )}

        {/* ── Step 2: Security question ── */}
        {step === 2 && (
          <>
            <p className="sub" style={{ textAlign:"center" }}>
              Answer your security question to verify it's you.
            </p>

            <div style={{
              background:"var(--y-light)", border:"1px solid var(--y-deep)",
              borderRadius:"var(--r-sm)", padding:"12px 14px",
              fontSize:".9rem", fontWeight:600, color:"var(--ink)",
              marginBottom:14, textAlign:"center"
            }}>
              🍂 What is your favourite season?
            </div>

            <div className="input-group">
              <label className="input-label">Your Answer</label>
              <select
                value={season}
                onChange={e => setSeason(e.target.value)}
                style={{ appearance:"none" }}
              >
                <option value="">— Select season —</option>
                {SEASONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-green btn-full btn-lg mt-8"
              onClick={verifySeason}
              disabled={loading}
            >
              {loading ? "Verifying…" : "Verify Answer →"}
            </button>

            <div style={{ textAlign:"center", marginTop:12 }}>
              <button
                onClick={() => { setStep(1); setError("") }}
                style={{ background:"none", border:"none", cursor:"pointer",
                  fontSize:".84rem", color:"var(--ink-soft)", textDecoration:"underline" }}
              >
                ← Back
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: New password ── */}
        {step === 3 && (
          <>
            <p className="sub" style={{ textAlign:"center" }}>
              Great! Now set a new password for your account.
            </p>

            <div className="input-group">
              <label className="input-label">New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Confirm New Password</label>
              <input
                type="password"
                placeholder="Repeat your new password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === "Enter" && resetPassword()}
              />
            </div>

            <button
              className="btn btn-green btn-full btn-lg mt-8"
              onClick={resetPassword}
              disabled={loading}
            >
              {loading ? "Saving…" : "Reset Password →"}
            </button>
          </>
        )}

        <div className="auth-footer">
          Remembered it? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword