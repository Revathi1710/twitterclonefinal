import express from 'express'; 
import { signup,login,logout,getMe } from '../Controller/auth.controller.js';
import procentRoute from '../middleware/procentRoute.js';

const router=express.Router();
router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/me", procentRoute,getMe);

export default router;