import mongoose from "mongoose"

const schema = new mongoose.Schema({

code:String,

discount:Number,

expiry:Date,

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
}

})

export default mongoose.model("Coupon",schema)