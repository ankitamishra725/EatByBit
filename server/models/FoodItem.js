import mongoose from "mongoose"

const schema = new mongoose.Schema({

name:String,

description:String,

price:Number,

studentPrice:Number,

image:String

})

export default mongoose.model("FoodItem",schema)