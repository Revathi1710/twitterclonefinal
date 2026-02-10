import express from 'express';
import protectRoute from '../middleware/procentRoute.js';
import { deleteNodification, getNodification } from '../Controller/nodification.controller.js';

const router= express.Router();
router.get("/",protectRoute,getNodification);
router.delete("/",protectRoute,deleteNodification)
export default router; 