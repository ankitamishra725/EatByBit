import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import FoodCard from "../components/FoodCard"
import { useCart } from "../CartContext"

function Skeleton() {
  return (
    <div className="food-card">
      <div className="skeleton" style={{ height: 185 }} />
      <div className="food-card__body" style={{ gap: 10 }}>
        <div className="skeleton" style={{ height: 16, width: "60%" }} />
        <div className="skeleton" style={{ height: 12, width: "90%" }} />
        <div className="flex-between" style={{ marginTop: 14 }}>
          <div className="skeleton" style={{ height: 22, width: 60 }} />
          <div className="skeleton" style={{ height: 32, width: 72, borderRadius: 99 }} />
        </div>
      </div>
    </div>
  )
}

function Menu() {
  const [foods,   setFoods]   = useState([])
  const [loading, setLoading] = useState(true)
  const [toast,   setToast]   = useState("")
  const { cart, addItem } = useCart()

  useEffect(() => {
    axios.get("http://localhost:5000/api/menu")
      .then(res => setFoods(res.data))
      .catch(() => setFoods([]))
      .finally(() => setLoading(false))
  }, [])

  const add = (item) => {
    addItem(item)
    setToast(`${item.name} added!`)
    setTimeout(() => setToast(""), 2200)
  }

  return (
    <div className="page">

      <div className="page-header flex-between">
        <div>
          <h2>Today's Menu 🍜</h2>
          <p>Fresh, affordable meals for students</p>
        </div>
        {cart.length > 0 && (
          <Link to="/tray">
            <button className="btn btn-yellow btn-sm">
              🛒 {cart.length} in tray →
            </button>
          </Link>
        )}
      </div>

      {toast && (
        <div className="alert alert-green">✅ {toast}</div>
      )}

      {loading ? (
        <div className="menu-grid">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} />)}
        </div>
      ) : foods.length === 0 ? (
        <div className="tray-empty">
          <span className="tray-empty-icon">🍽️</span>
          <h3>Menu is empty</h3>
          <p>The backend might be offline. Start the server and try again.</p>
        </div>
      ) : (
        <div className="menu-grid">
          {foods.map(item => (
            <FoodCard key={item._id} item={item} add={add} />
          ))}
        </div>
      )}

    </div>
  )
}

export default Menu