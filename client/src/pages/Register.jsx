import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

const SEASONS = ["Spring 🌸", "Summer ☀️", "Monsoon 🌧️", "Autumn 🍂", "Winter ❄️"]

function Register() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", college: "", studentId: "", favouriteSeason: ""
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const register = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required.")
      return
    }
    if (!form.favouriteSeason) {
      setError("Please select your favourite season — needed for account recovery.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form)
      localStorage.setItem("token",    res.data.token)
      localStorage.setItem("userId",   res.data.user._id)
      localStorage.setItem("userName", res.data.user.name)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card anim">
        <div style={{ textAlign:"center", fontSize:"2.5rem", marginBottom:8 }}>🍱</div>
        <h2 style={{ textAlign:"center" }}>Create Account</h2>
        <p className="sub" style={{ textAlign:"center" }}>Join EatByBit — student food made easy</p>

        {error && <div className="alert alert-red">{error}</div>}

        {/* Name */}
        <div className="input-group">
          <label className="input-label">Name</label>
          <input name="name" type="text" placeholder="Full Name"
            value={form.name} onChange={handleChange} />
        </div>

        {/* Email */}
        <div className="input-group">
          <label className="input-label">Email</label>
          <input name="email" type="email" placeholder="college@edu.in"
            value={form.email} onChange={handleChange} />
        </div>

        {/* Password */}
        <div className="input-group">
          <label className="input-label">Password</label>
          <input name="password" type="password" placeholder="••••••••"
            value={form.password} onChange={handleChange} />
        </div>

        {/* College */}
        <div className="input-group">
          <label className="input-label">College</label>
          <input name="college" type="text" placeholder="Your College Name"
            value={form.college} onChange={handleChange} />
        </div>

        {/* Student ID */}
        <div className="input-group">
          <label className="input-label">Student ID</label>
          <input name="studentId" type="text" placeholder="e.g. 2024CS001"
            value={form.studentId} onChange={handleChange} />
        </div>

        {/* Security question */}
        <div className="input-group">
          <label className="input-label">🔐 Security Question</label>
          <div style={{
            background: "var(--y-light)", border: "1px solid var(--y-deep)",
            borderRadius: "var(--r-sm)", padding: "10px 14px",
            fontSize: ".88rem", color: "var(--ink-mid)", marginBottom: 8
          }}>
            What is your favourite season?
          </div>
          <select
            name="favouriteSeason"
            value={form.favouriteSeason}
            onChange={handleChange}
            style={{ appearance: "none" }}
          >
            <option value="">— Select your answer —</option>
            {SEASONS.map(s => (
              <option key={s} value={s.split(" ")[0]}>{s}</option>
            ))}
          </select>
          <p style={{ fontSize:".76rem", color:"var(--ink-soft)", marginTop:4 }}>
            Remember this — you'll need it if you forget your password.
          </p>
        </div>

        <button
          className="btn btn-yellow btn-full btn-lg mt-8"
          onClick={register}
          disabled={loading}
        >
          {loading ? "Creating account…" : "Register →"}
        </button>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}

export default Register