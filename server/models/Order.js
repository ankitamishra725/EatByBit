import mongoose from "mongoose"

const schema = new mongoose.Schema({

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

items:Array,

total:Number,

paymentType:String,

status:{
type:String,
default:"Placed"
}

})

export default mongoose.model("Order",schema)