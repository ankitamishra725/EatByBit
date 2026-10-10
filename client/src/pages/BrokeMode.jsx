import { Link } from "react-router-dom"
import { useCart } from "../CartContext"

function BrokeMode() {
  const { total } = useCart()
  const amount = total || 0

  // Uses the same logic as server/utils/paymentLink.js and whatsappMessage.js
  const upiLink = `upi://pay?pa=eatbybit@upi&pn=EatByBit&am=${amount}`
  const message = `Hello kind human,

Sponsoring this meal will increase your good karma immediately.

A student's wallet is currently taking a break.

Meal Amount: ₹${amount}

Save the student here:
${upiLink}`

  const waLink = `https://wa.me/?text=${encodeURIComponent(message)}`

  return (
    <div className="page">
      <div className="broke-card anim">
        <div style={{ fontSize: "3rem", marginBottom: 12 }}>😅</div>
        <h2 style={{ marginBottom: 10 }}>Broke Mode</h2>
        <p>
          Wallet on a break? No judgment.<br />
          Share this message — let someone kind pay and earn serious karma.
        </p>

        {/* Amount display */}
        <div className="amount-box">
          <div style={{
            fontSize: ".78rem", color: "rgba(255,255,255,.6)",
            fontWeight: 700, textTransform: "uppercase",
            letterSpacing: ".06em", marginBottom: 4
          }}>
            Meal Amount
          </div>
          <strong>{amount > 0 ? `₹${amount}` : "Add items to tray first"}</strong>
        </div>

        {/* Live message preview */}
        <div style={{
          background: "rgba(255,255,255,.12)", borderRadius: "var(--r-md)",
          padding: "16px 18px", marginBottom: 24,
          textAlign: "left", fontSize: ".82rem",
          color: "rgba(255,255,255,.85)", lineHeight: 1.7,
          whiteSpace: "pre-line"
        }}>
          {message}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <a href={waLink} target="_blank" rel="noreferrer">
            <button className="btn btn-yellow btn-full btn-lg">
              📲 Send on WhatsApp
            </button>
          </a>

          {amount > 0 && (
            <a href={upiLink}>
              <button className="btn btn-full" style={{
                background: "rgba(255,255,255,.2)", color: "#fff",
                border: "1px solid rgba(255,255,255,.3)"
              }}>
                💳 Open UPI Payment
              </button>
            </a>
          )}

          {amount === 0 && (
            <Link to="/menu">
              <button className="btn btn-full" style={{
                background: "rgba(255,255,255,.2)", color: "#fff",
                border: "1px solid rgba(255,255,255,.3)"
              }}>
                Browse Menu First →
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default BrokeMode