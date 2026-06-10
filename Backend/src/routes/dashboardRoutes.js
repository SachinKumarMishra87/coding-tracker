import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getDashboardData,
  getTopicProgress
} from "../controller/dashboardController.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getDashboardData
);

// topic progress 
router.get( "/topic-progress", authMiddleware, getTopicProgress);



export default router;