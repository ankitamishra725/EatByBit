import express from "express"
import Coupon from "../models/Coupon.js"
import { generateCoupon } from "../utils/generateCoupon.js"

const router = express.Router()

// POST /api/coupons/create
router.post("/create", async (req, res) => {
  try {
    const coupon = await Coupon.create({
      code:     generateCoupon(),
      discount: 20,
      expiry:   new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      user:     req.body.user
    })
    res.json(coupon)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/coupons/user/:id
router.get("/user/:id", async (req, res) => {
  try {
    const coupons = await Coupon.find({ user: req.params.id })
      .sort({ createdAt: -1 })
    res.json(coupons)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router