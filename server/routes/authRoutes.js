import express from "express"
import bcrypt  from "bcryptjs"
import jwt     from "jsonwebtoken"
import User    from "../models/User.js"

const router = express.Router()
const SECRET = "eatbybitsecret"

// ── POST /api/auth/register ───────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, college, studentId, favouriteSeason } = req.body

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: "Email already registered" })

    const hashed = await bcrypt.hash(password, 10)
    const user   = await User.create({
      name, email, password: hashed,
      college, studentId, favouriteSeason
    })

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" })
    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── POST /api/auth/login ──────────────────────────
// Handles BOTH bcrypt-hashed passwords (new users)
// AND plain-text passwords (old users registered before bcrypt was added)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "No account found with this email" })

    let match = false

    // Try bcrypt first (new users)
    try {
      match = await bcrypt.compare(password, user.password)
    } catch (_) {
      match = false
    }

    // If bcrypt fails, check if it's a plain-text password (old users)
    // and if so, re-hash it so they work properly going forward
    if (!match && user.password === password) {
      match = true
      const rehashed = await bcrypt.hash(password, 10)
      await User.findByIdAndUpdate(user._id, { password: rehashed })
    }

    if (!match) return res.status(400).json({ message: "Wrong password" })

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" })
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── POST /api/auth/verify-season ─────────────────
// Step 1 of forgot-password: check email + favourite season
router.post("/verify-season", async (req, res) => {
  try {
    const { email, favouriteSeason } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "No account found with this email" })

    if (!user.favouriteSeason) {
      return res.status(400).json({
        message: "This account has no security question set. Please contact support."
      })
    }

    const match = user.favouriteSeason.toLowerCase().trim() ===
                  favouriteSeason.toLowerCase().trim()

    if (!match) return res.status(400).json({ message: "Wrong answer. Try again." })

    // Season matched — return a short-lived reset token
    const resetToken = jwt.sign({ id: user._id, reset: true }, SECRET, { expiresIn: "15m" })
    res.json({ resetToken, message: "Answer correct! Set your new password." })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── POST /api/auth/reset-password ────────────────
// Step 2 of forgot-password: set new password using reset token
router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body

    let decoded
    try {
      decoded = jwt.verify(resetToken, SECRET)
    } catch (_) {
      return res.status(400).json({ message: "Reset link expired. Please start again." })
    }

    if (!decoded.reset) return res.status(400).json({ message: "Invalid reset token" })

    const hashed = await bcrypt.hash(newPassword, 10)
    await User.findByIdAndUpdate(decoded.id, { password: hashed })

    res.json({ message: "Password reset successfully! You can now log in." })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router