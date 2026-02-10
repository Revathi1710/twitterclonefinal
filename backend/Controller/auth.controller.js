import User from "../Models/user.model.js";
import bcrypt from 'bcrypt';
import generateToken from "../utils/generateToken.js";

export const signup = async(req,res)=>{
    try {
        const {userName,fullName,email,password}=req.body;
       const existingUser= await User.findOne({email:email});
       const existingUsername=await User.findOne({userName});
       if(existingUser || existingUsername)
       {
        return  res.status(404).json({error:"User already existing Username or email"})
       }
      const salt=await bcrypt.genSalt(10);
      const hashedpassword=await bcrypt.hash(password,salt);
      const newUser= new User({
        userName,
        email,
        fullName,
        password:hashedpassword
      })
      if(newUser)
      {
        generateToken(newUser._id,res)
        await newUser.save();
        res.status(200).json({message :"New User Register  Successfully"})
      }

    } catch (error) {
        console.log("error signup controller",error);
        
        res.status(500).json({error:"internal server error"});
        }
        
    }

export const login =async (req,res)=>{
   try {
     const{ userName,password} =req.body;
     const user= await User.findOne({userName});
     const isPasswordcorrect=await bcrypt.compare(password,user?.password || '');
     if(!user || !isPasswordcorrect)
     {
      res.status(404).json({error:"Invalid Username or password"});
     }
     generateToken(user._id,res);
     res.status(200).json({message:"Login Successfully"})
   } catch (error) {
    console.log(`login controller error ${error}`);
    
    res.status(500).json({error:"internal error"});
   }
}

export const logout =async (req,res) => {
  try {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"logout successfully"})
    
  } catch (error) {
    console.log(`logout controller error ${error}`);
    res.status(500).json({error:"Internal error "})
    
  }
}
 export const getMe=async (req,res) => {
      try {
        const user=await User.findOne({_id:req.user._id}).select("-password");

        res.status(200).json(user);
         
      } catch (error) {
        console.log(`getMe controller error ${error}`);
    res.status(500).json({error:"Internal error "})
    
      }
 }   
