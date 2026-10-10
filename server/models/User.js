import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  email:           { type: String, required: true, unique: true },
  password:        { type: String, required: true },
  college:         { type: String },
  studentId:       { type: String },
  favouriteSeason: { type: String }   // for forgot-password recovery
})

export default mongoose.model("User", userSchema)