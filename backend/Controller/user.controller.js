import Nodification from "../Models/nodification.model.js";
import User from "../Models/user.model.js";
import cloudinary from 'cloudinary';

export const getProfile=async (req,res) => {
    try {
        const {username}=req.params;
        const user=await User.findOne({userName:username});
        if(!user){
          return  res.status(404).json({error:"User not found"});

        }
        res.status(200).json(user)
    } catch (error) {
        console.log(`error get profile controller ${error}`);
       res.status(500).json({error:"internal error"});
        
    }
}
export const followUnFollowUser = async (req, res) => {
    try {
        const { id } = req.params;   // user to follow/unfollow
        const currentUserId = req.user?._id;  // logged-in user ID

        if (!id || !currentUserId) {
            return res.status(404).json({ error: "Invalid user ID" });
        }

        // Prevent self-follow
        if (id === currentUserId.toString()) {
            return res.status(404).json({ error: "You cannot follow yourself" });
        }

        // Find both users
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(currentUserId);

        if (!userToModify || !currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // UNFOLLOW
            await User.findByIdAndUpdate(id, { $pull: { followers: currentUserId } });
            await User.findByIdAndUpdate(currentUserId, { $pull: { following: id } });

            return res.status(200).json({ message: "Unfollowed successfully" });
        }

        // FOLLOW
        await User.findByIdAndUpdate(id, { $push: { followers: currentUserId } });
        await User.findByIdAndUpdate(currentUserId, { $push: { following: id } });
//send nodification 
const newNodification =new Nodification({
    type:"follow",
    from:currentUser,
    to:userToModify._id
})
await newNodification.save();
        return res.status(200).json({ message: "Followed successfully" });

    } catch (error) {
        console.log(`error get followUnfollow controller ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const getSuggestedUsers=async (req,res) => {
    try {
       const userId=req.user._id;
       const UserFollowedByMe=await User.findById({_id:userId}).select("-password");
       const users=await User.aggregate([
        {
       
        $match:{
            _id:{$ne:userId}
        }
    },
        {
            $sample:{
                size:10
            }
        }
    
       ])
       const filteredUser=users.filter((user)=>!UserFollowedByMe.following.includes(user._id));
       const suggestedUser=filteredUser.slice(0,4);
       suggestedUser.forEach((user) => (user.password=null));
       res.status(200).json(suggestedUser)
    } catch (error) {
         console.log(`error get Suggestion Users controller ${error}`);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    let {
      userName,
      fullName,
      email,
      CurrentPassword,
      newPassword,
      bio,
      link,
      profileImg,
      coverImg,
    } = req.body;

    let user = await User.findById(userId);

    if ((!newPassword && CurrentPassword) || (!CurrentPassword && newPassword)) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    if (CurrentPassword && newPassword) {
      const isMatch = await bcrypt.compare(CurrentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid password" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // PROFILE IMAGE
    if (profileImg) {
      if (user.profileImg) {
        const publicId = user.profileImg.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const uploadResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadResponse.secure_url;
    }

    // COVER IMAGE
    if (coverImg) {
      if (user.coverImg) {
        const publicId = user.coverImg.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const uploadResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.userName = userName || user.userName;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();
    user.password = null;

    res.status(200).json(user);
  } catch (error) {
    console.log(`error get update user controller ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
