import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

function Login() {
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")
  const navigate = useNavigate()

  const login = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return }
    setLoading(true)
    setError("")
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password })
      localStorage.setItem("token",    res.data.token)
      localStorage.setItem("userId",   res.data.user._id)
      localStorage.setItem("userName", res.data.user.name)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card anim">
        <div style={{ textAlign:"center", fontSize:"2.5rem", marginBottom:8 }}>🍱</div>
        <h2 style={{ textAlign:"center" }}>Welcome back</h2>
        <p className="sub" style={{ textAlign:"center" }}>Log in to your EatByBit account</p>

        {error && <div className="alert alert-red">{error}</div>}

        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            type="email"
            placeholder="you@college.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
          />
        </div>

        <button
          className="btn btn-green btn-full btn-lg mt-8"
          onClick={login}
          disabled={loading}
        >
          {loading ? "Logging in…" : "Log In →"}
        </button>

        {/* Forgot password link */}
        <div style={{ textAlign:"center", marginTop:14 }}>
          <Link
            to="/forgot-password"
            style={{ fontSize:".86rem", color:"var(--ink-soft)", textDecoration:"underline" }}
          >
            Forgot password?
          </Link>
        </div>

        <div className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login