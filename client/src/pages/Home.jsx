import { Link } from "react-router-dom"

function Home() {
  const userName = localStorage.getItem("userName")

  const features = [
    { icon: "🍛", title: "Fresh Daily Menu",  desc: "Hot meals at student-friendly prices every day." },
    { icon: "💸", title: "Broke Mode",        desc: "Wallet dry? Let a kind friend sponsor your meal via WhatsApp." },
    { icon: "🎟️", title: "Auto Coupons",    desc: "Get ₹20 off coupon automatically after every order." },
    { icon: "👥", title: "Group Orders",      desc: "Order together, pay together, save together." },
  ]

  return (
    <div className="page">

      {/* Hero */}
      <div className="hero anim">
        <div className="hero-content">
          <h1>{userName ? `Hey ${userName}! 👋` : "Feed Your\nCravings. 🍜"}</h1>
          <p className="tagline">
            Affordable, delicious food built for students.
            Order in minutes, eat like royalty.
          </p>
          <div className="hero-actions">
            <Link to="/menu">
              <button className="btn btn-green btn-lg">Browse Menu</button>
            </Link>
            {!userName
              ? <Link to="/login"><button className="btn btn-ghost btn-lg">Sign In</button></Link>
              : <Link to="/tray"><button className="btn btn-ghost btn-lg">🛒 My Tray</button></Link>
            }
          </div>
        </div>
        <span className="hero-emoji">🍱</span>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { val: "₹60", label: "Starting from",   cls: "val-green"  },
          { val: "6+",  label: "Menu Items",       cls: "val-yellow" },
          { val: "₹20", label: "Coupon per order", cls: "val-green"  },
          { val: "😅",  label: "Broke Mode Ready", cls: "val-red"    },
        ].map((s, i) => (
          <div key={i} className="stat-card anim">
            <div className={`stat-card__val ${s.cls}`}>{s.val}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="section-title">Why EatByBit</div>
      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card anim">
            <span className="feature-card__icon">{f.icon}</span>
            <div className="feature-card__title">{f.title}</div>
            <p className="feature-card__desc">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA banner */}
      <div className="section-title">Get Started</div>
      <div style={{
        background: "linear-gradient(130deg, var(--g-light) 0%, var(--y-light) 100%)",
        borderRadius: "var(--r-xl)", padding: "32px",
        border: "1px solid var(--border)", textAlign: "center"
      }}>
        <div style={{ fontSize: "3rem", marginBottom: 12 }}>🍛 🍜 🥗 🥙 🍱</div>
        <h3 style={{ marginBottom: 6 }}>Burgers, Biryani, Wraps &amp; more</h3>
        <p className="text-muted" style={{ marginBottom: 20 }}>
          Real items from the menu — added fresh every day.
        </p>
        <Link to="/menu">
          <button className="btn btn-green btn-lg">See Full Menu →</button>
        </Link>
      </div>

    </div>
  )
}

export default Home