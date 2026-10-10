import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

function Coupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    axios.get(`http://localhost:5000/api/coupons/user/${userId}`)
      .then(res => setCoupons(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  if (!userId) return (
    <div className="page">
      <div className="tray-empty anim">
        <span className="tray-empty-icon">🎟️</span>
        <h3>Log in to see your coupons</h3>
        <Link to="/login">
          <button className="btn btn-green btn-lg mt-24">Log In →</button>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="page-header">
        <h2>My Coupons 🎟️</h2>
        <p>Earned automatically with every order — valid for 7 days</p>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[1, 2].map(i => (
            <div key={i} className="skeleton" style={{ height: 74, borderRadius: "var(--r-lg)" }} />
          ))}
        </div>
      ) : coupons.length === 0 ? (
        <div className="tray-empty anim">
          <span className="tray-empty-icon">🎟️</span>
          <h3>No coupons yet</h3>
          <p className="mt-8">Place an order to earn your first coupon — ₹20 off every time!</p>
          <Link to="/menu">
            <button className="btn btn-green btn-lg mt-24">Browse Menu →</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {coupons.map((c, i) => {
            const expired = new Date(c.expiry) < new Date()
            return (
              <div
                key={i}
                className="coupon-card anim"
                style={{ opacity: expired ? 0.5 : 1 }}
              >
                <div>
                  <div style={{
                    fontSize: ".7rem", fontWeight: 700, letterSpacing: ".06em",
                    textTransform: "uppercase", color: "var(--ink-mid)", marginBottom: 5
                  }}>
                    Coupon Code
                  </div>
                  <div className="coupon-code">{c.code}</div>
                  <div style={{ fontSize: ".75rem", color: "var(--ink-mid)", marginTop: 4 }}>
                    {expired
                      ? "❌ Expired"
                      : `✅ Valid till ${new Date(c.expiry).toLocaleDateString("en-IN")}`
                    }
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    fontSize: ".7rem", fontWeight: 700, letterSpacing: ".06em",
                    textTransform: "uppercase", color: "var(--ink-mid)", marginBottom: 5
                  }}>
                    Discount
                  </div>
                  <div className="coupon-discount">₹{c.discount} off</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Coupons