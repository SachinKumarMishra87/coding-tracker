// ==============================
// BookMarkModel.js
// ==============================

import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Bookmark = mongoose.model(
  "Bookmark",
  bookmarkSchema
);

export default Bookmark;