import mongoose from "mongoose";

const streakSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    currentStreak: {
        type: Number,
        default: 0
    },

    bestStreak: {
        type: Number,
        default: 0
    },

    lastSolvedDate: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

export default mongoose.model(
    "Streak",
    streakSchema
);