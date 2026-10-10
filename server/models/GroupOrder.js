import mongoose from "mongoose"

const schema = new mongoose.Schema({

creator:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

contributors:[{

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

amount:Number

}],

status:String

})

export default mongoose.model("GroupOrder",schema)