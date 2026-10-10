import { Link, useLocation } from "react-router-dom"
import { useCart } from "../CartContext"

function Navbar() {
  const { pathname } = useLocation()
  const { cart } = useCart()

  return (
    <nav className="navbar">
      <span className="navbar-brand">EatByBit 🍱</span>

      {[
        { to: "/",        label: "Home"    },
        { to: "/menu",    label: "Menu"    },
        { to: "/profile", label: "Profile" },
      ].map(l => (
        <Link
          key={l.to}
          to={l.to}
          className={`navbar-link ${pathname === l.to ? "active" : ""}`}
        >
          {l.label}
        </Link>
      ))}

      {/* Tray with live badge count */}
      <Link
        to="/tray"
        className={`navbar-link ${pathname === "/tray" ? "active" : ""}`}
        style={{ position: "relative" }}
      >
        🛒 Tray
        {cart.length > 0 && (
          <span style={{
            position: "absolute", top: -6, right: -6,
            background: "var(--r)", color: "#fff",
            borderRadius: "50%", width: 18, height: 18,
            fontSize: ".68rem", fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {cart.length}
          </span>
        )}
      </Link>
    </nav>
  )
}

export default Navbar