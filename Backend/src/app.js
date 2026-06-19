import 'dotenv/config';
import express from 'express';
import cors from 'cors';
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

const app = express();

// Render cloud proxy backend ke liye mandatory hai
app.set("trust proxy", 1);

// 🎯 Dynamic CORS configured for both apex and www domains
const allowedOrigins = [
    process.env.CLIENT_URL, // https://leetpattracker.in
    process.env.CLIENT_URL?.replace("https://", "https://www.") // Automatically adds https://www.leetpattracker.in
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl) or if it's in the allowed list
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// 🔥 COOKIE FIX: Passport/Google sessions ke liye first-party cross subdomain attribute setup
app.use(
    session({
        secret: "googleauthsecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,                  // HTTPS par hi chalega
            sameSite: "lax",               // Custom domain ki wajah se ab Lax secure aur responsive rahega
            domain: ".leetpattracker.in",  // 🎯 CRITICAL: Dot ke sath, taaki api aur main frontend dono access kar sakein
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

app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
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