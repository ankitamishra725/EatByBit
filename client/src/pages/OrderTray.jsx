import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useCart } from "../CartContext"

function OrderTray() {
  const { cart, removeItem, clearCart, total } = useCart()
  const [loading, setLoading] = useState(false)
  const [bill,    setBill]    = useState(null)
  const [payType, setPayType] = useState("direct")
  const [error,   setError]   = useState("")
  const navigate = useNavigate()

  const userId = localStorage.getItem("userId")

  const placeOrder = async () => {
    if (cart.length === 0) return
    setLoading(true)
    setError("")
    try {
      const res = await axios.post("http://localhost:5000/api/orders/create", {
        user:        userId || null,
        items:       cart.map(i => ({ name: i.name, price: i.studentPrice })),
        total,
        paymentType: payType
      })
      clearCart()
      setBill(res.data)
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order. Is the server running?")
    } finally {
      setLoading(false)
    }
  }

  // ── Bill receipt (shown after order is confirmed) ──
  if (bill) {
    const { order, coupon, upiLink, waLink } = bill
    const now = new Date().toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    })

    return (
      <div className="page">
        <div className="card anim" style={{ maxWidth: 480, margin: "0 auto" }}>

          {/* Header */}
          <div style={{
            textAlign: "center", paddingBottom: 16,
            borderBottom: "2px dashed var(--border)", marginBottom: 16
          }}>
            <div style={{ fontSize: "2.8rem", marginBottom: 8 }}>🧾</div>
            <h2 style={{ marginBottom: 4 }}>Order Confirmed!</h2>
            <p style={{ fontFamily: "monospace", fontSize: ".82rem", color: "var(--ink-soft)" }}>
              #{String(order._id).slice(-6).toUpperCase()} · {now}
            </p>
          </div>

          {/* Items */}
          {order.items.map((item, i) => (
            <div key={i} className="order-item">
              <span className="order-item__name">{item.name}</span>
              <span className="order-item__price">₹{item.price}</span>
            </div>
          ))}

          {/* Summary */}
          <div className="order-summary">
            <div className="order-summary__row">
              <span>Subtotal</span><span>₹{order.total}</span>
            </div>
            <div className="order-summary__row">
              <span>Student discount</span>
              <span className="text-green">✓ Applied</span>
            </div>
            <div className="order-summary__row">
              <span>Payment</span>
              <span>
                {order.paymentType === "direct" ? "💳 Direct"
                  : order.paymentType === "broke" ? "😅 Broke Mode"
                  : "👥 Group Order"}
              </span>
            </div>
            <div className="order-summary__total">
              <span>Total</span><span>₹{order.total}</span>
            </div>
          </div>

          {/* Coupon earned */}
          <div className="coupon-card mt-16 mb-16">
            <div>
              <div style={{
                fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: ".06em", color: "var(--ink-mid)", marginBottom: 4
              }}>
                🎟️ Coupon Earned
              </div>
              <div className="coupon-code">{coupon}</div>
              <div style={{ fontSize: ".72rem", color: "var(--ink-mid)", marginTop: 3 }}>
                Valid for 7 days
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: ".06em", color: "var(--ink-mid)", marginBottom: 4
              }}>
                Discount
              </div>
              <div className="coupon-discount">₹20 off</div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href={upiLink} style={{ display: "block" }}>
              <button className="btn btn-green btn-full btn-lg">
                💳 Pay Now via UPI — ₹{order.total}
              </button>
            </a>
            <a href={waLink} target="_blank" rel="noreferrer" style={{ display: "block" }}>
              <button className="btn btn-yellow btn-full">
                📲 Share on WhatsApp
              </button>
            </a>
            <button className="btn btn-ghost btn-full" onClick={() => navigate("/profile")}>
              View All Orders
            </button>
          </div>

        </div>
      </div>
    )
  }

  // ── Empty tray ──
  if (cart.length === 0) return (
    <div className="page">
      <div className="page-header"><h2>Order Tray 🛒</h2></div>
      <div className="tray-empty anim">
        <span className="tray-empty-icon">🍽️</span>
        <h3>Your tray is empty</h3>
        <p className="mt-8">Go to the menu and add something delicious!</p>
        <Link to="/menu">
          <button className="btn btn-green btn-lg mt-24">Browse Menu →</button>
        </Link>
      </div>
    </div>
  )

  // ── Tray with items ──
  return (
    <div className="page">

      <div className="page-header flex-between">
        <div>
          <h2>Order Tray 🛒</h2>
          <p>{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to="/menu">
          <button className="btn btn-ghost btn-sm">+ Add more</button>
        </Link>
      </div>

      {error && <div className="alert alert-red mb-16">{error}</div>}

      {/* Items list */}
      <div className="card anim mb-24">
        {cart.map((item, i) => (
          <div key={i} className="order-item">
            <div>
              <div className="order-item__name">{item.name}</div>
              <div style={{ fontSize: ".78rem", color: "var(--ink-soft)" }}>Student price</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="order-item__price">₹{item.studentPrice}</span>
              <button
                onClick={() => removeItem(i)}
                style={{
                  background: "var(--r-light)", color: "var(--r)",
                  border: "none", borderRadius: "50%",
                  width: 26, height: 26, cursor: "pointer",
                  fontWeight: 700, fontSize: "1rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0
                }}
              >×</button>
            </div>
          </div>
        ))}

        <div className="order-summary">
          <div className="order-summary__row">
            <span>Subtotal</span><span>₹{total}</span>
          </div>
          <div className="order-summary__row">
            <span>Student discount</span>
            <span className="text-green">✓ Applied</span>
          </div>
          <div className="order-summary__total">
            <span>Total</span><span>₹{total}</span>
          </div>
        </div>
      </div>

      {/* Payment type */}
      <div className="section-title">Choose Payment</div>

      {[
        { id: "direct", icon: "💳", label: "Pay Directly",  desc: "Opens UPI app — pay instantly with your phone" },
        { id: "group",  icon: "👥", label: "Group Order",   desc: "Split the bill — share UPI link with friends"  },
        { id: "broke",  icon: "😅", label: "Broke Mode",    desc: "Ask someone kind on WhatsApp to sponsor your meal" },
      ].map(opt => (
        <div
          key={opt.id}
          className={`payment-option anim ${payType === opt.id ? "selected" : ""}`}
          onClick={() => setPayType(opt.id)}
          style={{ cursor: "pointer" }}
        >
          <span className="payment-option__icon">{opt.icon}</span>
          <div style={{ flex: 1 }}>
            <div className="payment-option__label">{opt.label}</div>
            <div className="payment-option__desc">{opt.desc}</div>
          </div>
          <div style={{
            width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
            border: `2px solid ${payType === opt.id ? "var(--g)" : "var(--border-strong)"}`,
            background: payType === opt.id ? "var(--g)" : "transparent",
            transition: "all .2s"
          }} />
        </div>
      ))}

      {!userId && (
        <div className="alert alert-yellow mt-16">
          💡 <Link to="/login" style={{ color: "var(--y-deep)", fontWeight: 700 }}>Log in</Link> to save your order history and earn coupons
        </div>
      )}

      <div className="mt-24">
        <button
          className="btn btn-green btn-full btn-lg"
          onClick={placeOrder}
          disabled={loading}
        >
          {loading ? "Placing order…" : `Confirm & Place Order — ₹${total}`}
        </button>
      </div>

    </div>
  )
}

export default OrderTray