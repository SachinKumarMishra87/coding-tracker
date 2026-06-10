import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    description: {
        type: String
    },

    patternCount: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;