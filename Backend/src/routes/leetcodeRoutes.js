import express from "express";

import {
    getLeetcodeStats
} from "../controller/leetcodeController.js";

const router = express.Router();

router.get(
    "/:username",
    getLeetcodeStats
);

export default router;
