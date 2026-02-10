import Nodification from "../Models/nodification.model.js";

export const getNodification =async (req,res) => {
    try {
        const userId=req.user._id;
        const nodification =await Nodification.find({to:userId})
        .populate({
            path:"from",
            select:"username profileImg"
        })

        await Nodification.updateMany({to:userId},{read:true})

        res.status(200).json(nodification)
    } catch (error) {
        console.log(`error on get Nodification ${error}`);
        res.status(500).json({message:"internal server error"})
        
    }
}

export const deleteNodification =async (req,res) => {
    try {
        const userId=req.user._id;
        await Nodification.deleteMany({to:userId});

        res.status(200).json({message:"nodification delete successfully"})
    } catch (error) {
          console.log(`error on delete Nodification ${error}`);
        res.status(500).json({message:"internal server error"})
    }
}