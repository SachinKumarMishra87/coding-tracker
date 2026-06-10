// ==============================
// questionRoutes.js
// ==============================

import express from "express";

import {
  addQuestion,
  deleteQuestion,
  getProgress,
  getQuestionsByPattern,
  searchQuestions,
  toggleSolved,
  updateQuestion,
  toggleBookmark,
  getBookmarks,
  getNote,
  saveNote,
  deleteNote,
  getAllNotes,
  getSolvedQuestions,
  getBookmarkedQuestions,
  getDueRevisions,
  addToRevision,
  completeRevision
} from "../controller/questionController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// ADD QUESTION
router.post(
  "/add-question",
  authMiddleware,
  adminMiddleware,
  addQuestion
);

// GET QUESTIONS
router.get(
  "/pattern/:patternId",
  getQuestionsByPattern
);

// TOGGLE SOLVED
router.patch(
  "/toggle-solved/:id",
  authMiddleware,
  toggleSolved
);

// DELETE QUESTION
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteQuestion
);

// UPDATE QUESTION
router.put(
  "/update-question/:id",
  authMiddleware,
  adminMiddleware,
  updateQuestion
);

// GET PROGRESS
router.get(
  "/progress",
  authMiddleware,
  getProgress
);

// SEARCH
router.get(
  "/search/question",
  searchQuestions
);

// BOOKMARK
router.patch(
  "/raw-bookmark/:id",
  authMiddleware,
  toggleBookmark
);

// GET BOOKMARKS
router.get(
  "/raw-bookmark",
  authMiddleware,
  getBookmarks
);

// save note
router.post(
  "/note/:id",
  authMiddleware,
  saveNote
);

// get note
router.get(
  "/note/:id",
  authMiddleware,
  getNote
);

// delete note
router.delete(
  "/note/:id",
  authMiddleware,
  deleteNote
);

router.get(
  "/all-notes",
  authMiddleware,
  getAllNotes
);

router.get(
    "/solved",
    authMiddleware,
    getSolvedQuestions
);

router.get(
   "/bookmarks",
   authMiddleware,
   getBookmarkedQuestions
);

router.get(
  "/revision/due",
  authMiddleware,
  getDueRevisions
);

router.patch(
   "/add-to-revision/:id",
   authMiddleware,
   addToRevision
);

router.patch(
  "/revision/complete/:id",
  authMiddleware,
  completeRevision
);


export default router;