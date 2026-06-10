import express from "express";

import { addTopic, deleteTopic, getAllTopics, getTopicById, updateTopic } from "../controller/topicController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
    "/add-topic",
    authMiddleware,
    adminMiddleware,
    addTopic
);

router.get("/", getAllTopics);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteTopic
);


router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateTopic
);

router.get("/:topicId", getTopicById);

export default router;