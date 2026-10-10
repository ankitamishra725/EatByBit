import { useState } from "react"
import API from "../api"
import { Link } from "react-router-dom"

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", college: "", studentId: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState("")

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const register = async () => {
    if (!form.name || !form.email || !form.password) { setError("Name, email and password are required."); return }
    setLoading(true); setError("")
    try {
      await API.post("/api/auth/register", form)
      setSuccess(true)
    } catch {
      setError("Registration failed. This email may already be in use.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-wrap">
        <div className="auth-card anim" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎉</div>
          <h2>You're in!</h2>
          <p className="sub">Your EatByBit account is ready.</p>
          <Link to="/login">
            <button className="btn btn-green btn-full btn-lg mt-16">Log In Now →</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card anim">
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span style={{ fontSize: "2.5rem" }}>🍱</span>
        </div>
        <h2 style={{ textAlign: "center" }}>Create Account</h2>
        <p className="sub" style={{ textAlign: "center" }}>Join EatByBit — student food made easy</p>

        {error && <div className="alert alert-red">{error}</div>}

        {[
          { name: "name",      placeholder: "Full Name",   label: "Name" },
          { name: "email",     placeholder: "college@edu", label: "Email", type: "email" },
          { name: "password",  placeholder: "••••••••",    label: "Password", type: "password" },
          { name: "college",   placeholder: "Your College Name", label: "College" },
          { name: "studentId", placeholder: "e.g. 2024CS001",   label: "Student ID" },
        ].map(f => (
          <div className="input-group" key={f.name}>
            <label className="input-label">{f.label}</label>
            <input
              name={f.name}
              type={f.type || "text"}
              placeholder={f.placeholder}
              value={form[f.name]}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="mt-8">
          <button
            className="btn btn-yellow btn-full btn-lg"
            onClick={register}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Register →"}
          </button>
        </div>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}

export default Register