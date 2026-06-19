import 'dotenv/config';
import express from 'express';
import cors from 'cors';
// import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import patternRoutes from "./routes/patternRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import leetcodeRoutes from "./routes/leetcodeRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";

import session from "express-session";
import passport from "./config/passport.js";
import deleteClosedTickets from './utils/deleteClosedTickets.js';
// dotenv.config();

const app = express();

// 🔥 FIX 1: Express ko proxy par trust karne ke liye bolega (Render deployment ke liye mandatory hai)
app.set("trust proxy", 1);

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Is part ko thoda modify karein
app.use(
    session({
        secret: "googleauthsecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,       // Render (HTTPS) ke liye mandatory hai
            sameSite: "none",   // Vercel se Render pe cookie bhejne ke liye mandatory hai
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 din
        }
    })
);

app.use(passport.initialize());

app.use(passport.session());

connectDB();

deleteClosedTickets();
setInterval(() => {

    deleteClosedTickets();

}, 60 * 60 * 1000);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes)
app.use('/api/topics', topicRoutes)
app.use("/api/patterns", patternRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/leetcode", leetcodeRoutes);
app.use("/api/support", supportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});