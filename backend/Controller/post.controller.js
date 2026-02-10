import Nodification from "../Models/nodification.model.js";
import Post from "../Models/post.model.js";
import User from "../Models/user.model.js";
import cloudinary from "cloudinary";

export const createPost= async (req,res) => {
    try {
        const {text}=req.body;
        let {img}=req.body;
        const userId=req.user._id.toString();
        const user=await User.findOne({_id:userId});
        if(!user)
        {
            return res.status(400).json({message:"user not found"})
        }
        if(!text && !img)
        {
            return res.status(400).json({message:"text or post are missing"})
        }
        if(img){
            const uploadResponse=await cloudinary.uploader.upload(img);
            img =uploadResponse.secure_url;
        }
        const newPost=new Post({
            user:userId,
            text,
            img
        })
        await newPost.save();
        res.status(200).json(newPost);
        
    } catch (error) {
        console.log(`error create the post ${error}`);
        res.status(500).json({message:"internal error "})
        
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            // UNLIKE: Remove user from post.likes and remove post from user.likedPosts
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

            // Filter locally to return the new state without another DB query
            const updatedLikes = post.likes.filter(id => id.toString() !== userId.toString());
            return res.status(200).json(updatedLikes);
        } else {
            // LIKE: Add user to post.likes and add post to user.likedPosts
            post.likes.push(userId);
            await post.save();

            // FIXED: Should be $push for adding to likedPosts
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });

            const notification = new Nodification({ // Fixed typo from 'Nodification'
                from: userId,
                to: post.user,
                type: "like"
            });
            await notification.save();

            const updatedLikes = post.likes;
            return res.status(200).json(updatedLikes);
        }
    } catch (error) {
        console.log(`Error in likeUnlikePost: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const createCommand=async (req,res) => {
    try {
        const {text} =req.body;
       const postId = req.params.id;

        const userId=req.user._id;
        if(!text)
        {
            return res.status(404).json({message:"comment text is required"})
        }
  
          const post = await Post.findOne({ _id: postId });  // FIXED findOne
        if(!post){
           return res.status(404).json({message:"post not found"});
        }
        const comment ={
            user:userId,
            text
        }
        post.comments.push(comment);
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.log(`error comment the post ${error}`);
        res.status(500).json({message:"internal error "}) 
    }
}

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(`error delete the post ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPost = async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		if (posts.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getAllPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
export const getLikedPosts = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const likedPosts = await Post.find({
            _id: { $in: user.likedPosts },
        })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password -email -following -followers -bio -link",
            });

        // ✅ IMPORTANT: send response
        res.status(200).json(likedPosts);

    } catch (error) {
        console.error("Error in getLikedPosts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getFollowingPost = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })   // ✅ fixed typo
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log(`error getting following posts: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getUserPost = async (req, res) => {
    try {
        const { username } = req.params;

        // ✅ FIX: match schema field name
        const user = await User.findOne({ userName: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const posts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getUserPost:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
