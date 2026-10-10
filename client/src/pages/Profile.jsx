import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

function Profile() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const userId   = localStorage.getItem("userId")
  const userName = localStorage.getItem("userName")
  const token    = localStorage.getItem("token")

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    axios.get(`http://localhost:5000/api/orders/user/${userId}`)
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  const logout = () => { localStorage.clear(); navigate("/login") }

  const totalSpent   = orders.reduce((s, o) => s + (o.total || 0), 0)
  const totalSavings = Math.round(orders.reduce((s, o) => s + (o.total || 0) * 0.2, 0))

  // Not logged in
  if (!token) return (
    <div className="page">
      <div className="tray-empty anim">
        <span className="tray-empty-icon">👤</span>
        <h3>Not logged in</h3>
        <p className="mt-8">Log in to see your orders, coupons and profile.</p>
        <div className="mt-24 flex gap-12 flex-wrap" style={{ justifyContent: "center" }}>
          <Link to="/login">   <button className="btn btn-green btn-lg">Log In →</button></Link>
          <Link to="/register"><button className="btn btn-yellow btn-lg">Register</button></Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page">

      {/* Header */}
      <div className="profile-header anim">
        <div className="profile-avatar">{userName?.[0]?.toUpperCase() || "S"}</div>
        <div>
          <h3>{userName || "Student"}</h3>
          <p style={{ marginTop: 3, color: "var(--ink-soft)" }}>EatByBit Member</p>
          <span className="badge badge-green" style={{ marginTop: 8, display: "inline-block" }}>
            ✓ Logged in
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { val: orders.length,   label: "Total Orders",   cls: "val-yellow" },
          { val: `₹${totalSpent}`, label: "Total Spent",   cls: "val-green"  },
          { val: `₹${totalSavings}`, label: "Student Saved", cls: "val-green" },
          { val: orders.length,   label: "Coupons Earned", cls: "val-red"    },
        ].map((s, i) => (
          <div key={i} className="stat-card anim">
            <div className={`stat-card__val ${s.cls}`}>{s.val}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="features-grid mb-24">
        <Link to="/coupons" style={{ textDecoration: "none" }}>
          <div className="feature-card anim">
            <span className="feature-card__icon">🎟️</span>
            <div className="feature-card__title">My Coupons</div>
            <p className="feature-card__desc">₹20 off earned per order</p>
          </div>
        </Link>
        <Link to="/menu" style={{ textDecoration: "none" }}>
          <div className="feature-card anim">
            <span className="feature-card__icon">🍜</span>
            <div className="feature-card__title">Order Again</div>
            <p className="feature-card__desc">Browse today's fresh menu</p>
          </div>
        </Link>
        <Link to="/broke" style={{ textDecoration: "none" }}>
          <div className="feature-card anim">
            <span className="feature-card__icon">😅</span>
            <div className="feature-card__title">Broke Mode</div>
            <p className="feature-card__desc">Share meal request on WhatsApp</p>
          </div>
        </Link>
      </div>

      {/* Order history */}
      <div className="section-title">Order History</div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2].map(i => (
            <div key={i} className="skeleton" style={{ height: 90, borderRadius: "var(--r-lg)" }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="card text-center" style={{ padding: "32px 20px" }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>🍽️</div>
          <p>
            No orders yet.{" "}
            <Link to="/menu" style={{ color: "var(--g-deep)", fontWeight: 600 }}>
              Order your first meal →
            </Link>
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((order, i) => (
            <div key={i} className="card anim">
              <div className="flex-between mb-8">
                <span style={{
                  fontFamily: "monospace", fontWeight: 700,
                  fontSize: ".85rem", color: "var(--ink-soft)"
                }}>
                  #{String(order._id).slice(-6).toUpperCase()}
                </span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {order.createdAt && (
                    <span style={{ fontSize: ".75rem", color: "var(--ink-soft)" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </span>
                  )}
                  <span className="badge badge-green">{order.status}</span>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                {order.items?.map((item, j) => (
                  <span key={j} className="badge badge-yellow">{item.name}</span>
                ))}
              </div>

              <div className="flex-between">
                <span style={{ fontSize: ".82rem", color: "var(--ink-soft)" }}>
                  {order.paymentType === "direct" ? "💳 Direct Pay"
                    : order.paymentType === "broke" ? "😅 Broke Mode"
                    : "👥 Group Order"}
                </span>
                <span style={{
                  fontFamily: "var(--ff-head)", fontWeight: 800,
                  color: "var(--g-deep)", fontSize: "1.05rem"
                }}>
                  ₹{order.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-24 flex gap-12 flex-wrap">
        <Link to="/coupons">
          <button className="btn btn-yellow">🎟️ My Coupons</button>
        </Link>
        <button className="btn btn-ghost" onClick={logout}>Log Out</button>
      </div>

    </div>
  )
}

export default Profile