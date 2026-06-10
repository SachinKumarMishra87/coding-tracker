import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        default: null
    },
    otp: {
        type: String
    },

    otpExpire: {
        type: Date
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    dailyHintCount: {
        type: Number,
        default: 0
    },
    lastHintDate: {
        type: Date,
        default: null
    },
    profileImage: {
        type: String,
        default: ""
    },

    profession: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: ""
    },

    location: {
        type: String,
        default: ""
    },

    github: {
        type: String,
        default: ""
    },

    linkedin: {
        type: String,
        default: ""
    },

    portfolio: {
        type: String,
        default: ""
    },

    leetcodeUsername: {
        type: String,
        default: ""
    },
    leetcodeUrl: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;    