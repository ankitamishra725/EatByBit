// Auto-maps food names to real Unsplash photos
const FOOD_PHOTOS = {
  burger:   "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=200&fit=crop",
  pizza:    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=200&fit=crop",
  sandwich: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=200&fit=crop",
  pasta:    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=200&fit=crop",
  rice:     "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=200&fit=crop",
  curry:    "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=200&fit=crop",
  noodles:  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=200&fit=crop",
  salad:    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop",
  biryani:  "https://images.unsplash.com/photo-1563379091339-03246963d96d?w=400&h=200&fit=crop",
  dosa:     "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=200&fit=crop",
  wrap:     "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=200&fit=crop",
  default:  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop",
}

function getPhoto(name = "") {
  const lower = name.toLowerCase()
  for (const key of Object.keys(FOOD_PHOTOS)) {
    if (lower.includes(key)) return FOOD_PHOTOS[key]
  }
  return FOOD_PHOTOS.default
}

function FoodCard({ item, add }) {
  const photo = item.image || getPhoto(item.name)
  const isHot = item.isPopular || item.studentPrice <= 70

  return (
    <div className="food-card anim">
      <div className="food-card__img">
        <img
          src={photo}
          alt={item.name}
          loading="lazy"
          onError={e => { e.target.style.display = "none" }}
        />
        {isHot && (
          <span className="food-card__badge badge badge-hot">🔥 Popular</span>
        )}
      </div>

      <div className="food-card__body">
        <div className="food-card__name">{item.name}</div>
        <p className="food-card__desc">
          {item.description || "A student favourite, freshly prepared."}
        </p>
        <div className="food-card__footer">
          <span className="food-card__price">₹{item.studentPrice}</span>
          {add && (
            <button className="btn btn-green btn-sm" onClick={() => add(item)}>
              + Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodCard