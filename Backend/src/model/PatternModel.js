import mongoose from "mongoose";

const patternSchema = new mongoose.Schema({

    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String
    },

    questionCount: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

const Pattern = mongoose.model("Pattern", patternSchema);

export default Pattern;