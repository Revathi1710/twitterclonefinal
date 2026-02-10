import mongoose from "mongoose";

const nodificationSchema=mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    to:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        required:true,
        enum:['follow','like']
    },
read:{
    type:Boolean,
    default:false
}

},{timeStamps:true});

const Nodification=mongoose.model("Nodification",nodificationSchema);
export default Nodification;