import express from "express"
import cors from "cors"

import connectDB from "./config/db.js"

import authRoutes from "./routes/authRoutes.js"
import menuRoutes from "./routes/menuRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import couponRoutes from "./routes/couponRoutes.js"

connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/menu",menuRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/coupons",couponRoutes)

app.listen(5000,()=>{

console.log("Server running on 5000")

})