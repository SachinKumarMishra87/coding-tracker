import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getHint } from "../controller/aiController.js";

const router = express.Router();

router.post(
  "/hint",
  authMiddleware,
  getHint
);

export default router;