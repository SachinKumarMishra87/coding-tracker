import User from "../model/User.js";

// =========================
// GET PROFILE
// =========================

export const getProfile = async (
    req,
    res
) => {

    try {

        const user =
            await User.findById(
                req.user.id
            ).select("-password");

        res.json({

            success: true,

            user

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =========================
// UPDATE PROFILE
// =========================

const extractLeetcodeUsername = (url) => {
    if (!url) return "";

    try {
        const clean = url.trim().replace(/\/$/, "");
        const parts = clean.split("/");

        return parts[parts.length - 1];
    } catch (err) {
        return "";
    }
};

export const updateProfile = async (req, res) => {
    try {

        let updatedData = { ...req.body };

        // 🔥 URL → username convert
        if (req.body.leetcodeUrl) {
            updatedData.leetcodeUsername =
                extractLeetcodeUsername(req.body.leetcodeUrl);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updatedData,
            { new: true }
        ).select("-password");

        res.json({
            success: true,
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};