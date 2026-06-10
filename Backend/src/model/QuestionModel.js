// ==============================
// QuestionModel.js
// ==============================

import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    patternId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pattern",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true
    },

    platform: {
      type: String,
      default: "LeetCode"
    },

    link: {
      type: String,
      required: true
    },

    youtubeLink: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Question = mongoose.model(
  "Question",
  questionSchema
);

export default Question;