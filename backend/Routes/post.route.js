import express from 'express';
import protectRoute from '../middleware/procentRoute.js';
import { createCommand, createPost, deletePost, getAllPost, getFollowingPost, getLikedPosts, getUserPost, likeUnlikePost } from '../Controller/post.controller.js';

const   router=express.Router();
  router.post("/create",protectRoute,createPost);
  router.post("/like/:id",protectRoute,likeUnlikePost);
router.post("/command/:id",protectRoute,createCommand);
  router.delete("/:id",protectRoute,deletePost);
  router.get("/all",protectRoute,getAllPost);
    router.get("/likes/:id",protectRoute,getLikedPosts);
    router.get("/following",protectRoute,getFollowingPost);
    router.get("/user/:username",protectRoute,getUserPost)

export default router;