import express from "express";

import {
  createTicket,
  getAllTickets,
  getMyTickets,
  getSingleTicket,
  replyTicket,
  updateStatus,
  userReplyTicket
} from "../controller/supportController.js";


import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/create-ticket",
  authMiddleware,
  createTicket
);

router.get(
  "/my-tickets",
  authMiddleware,
  getMyTickets
);

// Only for admin to view all tickets
router.get(
  "/all-tickets",
  authMiddleware,
  adminMiddleware,
  getAllTickets
);


router.get(
  "/:id",
  authMiddleware,
  getSingleTicket
);

router.patch(
  "/reply/:id",
  authMiddleware,
  adminMiddleware,
  replyTicket
);

router.patch(
  "/status/:id",
  authMiddleware,
  adminMiddleware,
  updateStatus
);

router.patch(
  "/user-reply/:id",
  authMiddleware,
  userReplyTicket
);
export default router;