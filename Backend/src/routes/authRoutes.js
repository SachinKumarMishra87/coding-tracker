import express from "express";
import { forgotPassword, getMe, getPublicProfile, login, logout, resetPassword, sendOtp, uploadProfileImage, verifyForgotOtp, verifyOtpAndRegister } from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();
// register route
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndRegister);


router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-otp", verifyForgotOtp);
router.post("/reset-password", resetPassword);

router.post("/logout", logout);
router.get("/getuser", authMiddleware, getMe);
router.post("/upload-profile", authMiddleware, upload.single("profileImage"), uploadProfileImage);

// GOOGLE LOGIN

router.get(

    "/google",

    passport.authenticate(

        "google",

        {

            scope: [
                "profile",
                "email"
            ],

            prompt: "consent select_account"

        }

    )

);

router.get(

    "/google/callback",

    passport.authenticate(

        "google",

        {

            session: false,

            failureRedirect:
                "http://localhost:5173/login"

        }

    ),

    async (req, res) => {

        // JWT TOKEN

        const token = jwt.sign(

            {

                id: req.user._id,

                role: req.user.role

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        // COOKIE

        res.cookie(

            "token",

            token,

            {

                httpOnly: true,

                secure: false,

                sameSite: "lax"

            }

        );

        // REDIRECT

        return res.redirect(
            "http://localhost:5173/profile"
        );

    }

);

// pulic profile route
router.get("/public/:username",getPublicProfile);
export default router;