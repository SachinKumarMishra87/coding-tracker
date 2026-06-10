import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    isSolved: {
      type: Boolean,
      default: true,
    },

    // revision system

    needsRevision: {
      type: Boolean,
      default: false,
    },

    nextRevisionDate: {
      type: Date,
    },

    revisionCount: {
      type: Number,
      default: 0,
    },

    lastSolvedAt: {
      type: Date,
      default: Date.now,
    },

  },
  { timestamps: true }
);

export default mongoose.model("UserProgress", userProgressSchema);