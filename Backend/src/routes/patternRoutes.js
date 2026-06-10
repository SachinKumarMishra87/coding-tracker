import express from "express";

import {
    addPattern,
    deletePattern,
    getPatternById,
    getPatternsByTopic,
    updatePattern
} from "../controller/PatternController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
    "/add-pattern",
    authMiddleware,
    adminMiddleware,
    addPattern
);

router.get("/:topicId", getPatternsByTopic);
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deletePattern
);

router.put(
    "/update-pattern/:id",
    authMiddleware,
    adminMiddleware,
    updatePattern
);

router.get("/details/:patternId", getPatternById)

export default router;