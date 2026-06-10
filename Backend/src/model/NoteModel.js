import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
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
    },
    questionTitle: {
      type: String,
      default: ""
    },
    note: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;