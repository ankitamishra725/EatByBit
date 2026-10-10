import express from "express"
import Order   from "../models/Order.js"
import Coupon  from "../models/Coupon.js"
import { generateCoupon } from "../utils/generateCoupon.js"
import { generateUPI }    from "../utils/paymentLink.js"
import { brokeMessage }   from "../utils/whatsappMessage.js"

const router = express.Router()

// POST /api/orders/create
// Saves order → generates coupon → returns bill + UPI link + WhatsApp link
router.post("/create", async (req, res) => {
  try {
    const { user, items, total, paymentType } = req.body

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" })

    // Save order
    const order = await Order.create({ user, items, total, paymentType, status: "Placed" })

    // Auto-generate coupon (only for logged-in users)
    const couponCode = generateCoupon()
    if (user) {
      await Coupon.create({
        code:     couponCode,
        discount: 20,
        expiry:   new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        user
      })
    }

    // UPI payment deep-link
    const upiLink = generateUPI(total)

    // WhatsApp Broke Mode message (uses your existing util)
    const waMessage = brokeMessage(total, upiLink)
    const waLink    = `https://wa.me/?text=${encodeURIComponent(waMessage)}`

    res.json({ order, coupon: couponCode, upiLink, waLink })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

// GET /api/orders/user/:id
router.get("/user/:id", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id })
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router