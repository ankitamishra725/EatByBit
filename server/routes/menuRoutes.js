import express from "express"
import FoodItem from "../models/FoodItem.js"

const router = express.Router()

// GET /api/menu  — fetch all menu items
router.get("/", async (req, res) => {
  try {
    const foods = await FoodItem.find()
    res.json(foods)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/menu/add  — add a single item
router.post("/add", async (req, res) => {
  try {
    const food = await FoodItem.create(req.body)
    res.json(food)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router