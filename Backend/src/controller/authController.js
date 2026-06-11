import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/mail.js";


export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          email,
          otp,
          otpExpire: Date.now() + 5 * 60 * 1000
        }
      },
      { upsert: true }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "LeetPatTracker - OTP Verification 🔐",
      html: `
  <div style="font-family: Arial, sans-serif; padding:30px; color:#ffffff;">

    <div style="max-width:500px;margin:auto;background:#111827;padding:25px;border-radius:12px;border:1px solid #374151;">

      <h2 style="text-align:center;color:#22c55e;margin-bottom:10px;">
        🚀 LeetPatTracker
      </h2>

      <p style="text-align:center;color:#9ca3af;font-size:14px;">
        Your Coding Journey OTP Verification
      </p>

      <hr style="border:0;border-top:1px solid #374151;margin:20px 0;" />

      <p style="font-size:14px;color:#d1d5db;">
        Hello Coder 👋,
      </p>

      <p style="font-size:14px;color:#d1d5db;">
        Use the OTP below to verify your account and continue your DSA journey on LeetPatTracker.
      </p>

      <div style="text-align:center;margin:25px 0;">
        <div style="
          display:inline-block;
          background:#22c55e;
          color:#0f172a;
          font-size:28px;
          font-weight:bold;
          letter-spacing:6px;
          padding:12px 25px;
          border-radius:10px;
        ">
          ${otp}
        </div>
      </div>

      <p style="text-align:center;color:#f87171;font-size:13px;">
        ⚠️ This OTP is valid for 5 minutes only
      </p>

      <hr style="border:0;border-top:1px solid #374151;margin:20px 0;" />

      <p style="font-size:12px;color:#9ca3af;text-align:center;">
        Keep grinding 💪 | Solve DSA daily | Build consistency
      </p>

      <p style="font-size:12px;color:#6b7280;text-align:center;">
        — Team LeetPatTracker
      </p>

    </div>
  </div>
  `
    });

    return res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const verifyOtpAndRegister = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    user.username = name;
    user.password = await bcrypt.hash(password, 10);
    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    // 🔥 CREATE JWT TOKEN
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔥 SET COOKIE
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({
        success: true,
        message: "Account created successfully",
      });


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔐 COOKIE ONLY (NO TOKEN IN RESPONSE)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // OTP generate
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    // send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "LeetPatTracker - Password Reset OTP 🔐",
      html: `
  <div style="font-family: Arial, sans-serif; padding:30px; color:#ffffff;">

    <div style="max-width:500px;margin:auto;background:#111827;padding:25px;border-radius:12px;border:1px solid #374151;">

      <h2 style="text-align:center;color:#ef4444;margin-bottom:10px;">
        🔐 Password Reset
      </h2>

      <p style="text-align:center;color:#9ca3af;font-size:14px;">
        Secure OTP for resetting your password
      </p>

      <hr style="border:0;border-top:1px solid #374151;margin:20px 0;" />

      <p style="font-size:14px;color:#d1d5db;">
        Hello Coder 👋,
      </p>

      <p style="font-size:14px;color:#d1d5db;">
        We received a request to reset your password on LeetPatTracker. Use the OTP below to continue.
      </p>

      <div style="text-align:center;margin:25px 0;">
        <div style="
          display:inline-block;
          background:#ef4444;
          color:#0f172a;
          font-size:28px;
          font-weight:bold;
          letter-spacing:6px;
          padding:12px 25px;
          border-radius:10px;
        ">
          ${otp}
        </div>
      </div>

      <p style="text-align:center;color:#f87171;font-size:13px;">
        ⚠️ This OTP is valid for 5 minutes only
      </p>

      <p style="text-align:center;color:#f87171;font-size:13px;">
        If you did not request this, you can safely ignore this email.
      </p>

      <hr style="border:0;border-top:1px solid #374151;margin:20px 0;" />

      <p style="font-size:12px;color:#9ca3af;text-align:center;">
        Keep your account secure 🔒 | Never share OTP with anyone
      </p>

      <p style="font-size:12px;color:#6b7280;text-align:center;">
        — Team LeetPatTracker
      </p>

    </div>
  </div>
  `
    });

    return res.json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    return res.json({
      success: true,
      message: "OTP verified",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    // clear OTP
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {

  try {

    const user = await User.findById(req.user._id)
      .select("-password");

    return res.status(200).json({

      success: true,

      user: {
        profileImage: user.profileImage,
        username: user.username,
        email: user.email,
        role: user.role,
        _id: user._id
      }

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

export const uploadProfileImage = async (
  req,
  res
) => {

  try {

    if (!req.file) {

      return res.status(400).json({

        success: false,
        message: "No image uploaded"

      });

    }

    const updatedUser = await User.findByIdAndUpdate(

      req.user.id,

      {
        profileImage: req.file.path
      },

      {
        new: true
      }

    );

    return res.status(200).json({

      success: true,

      user: updatedUser

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Image upload failed"

    });

  }

};

export const getPublicProfile = async (
  req,
  res
) => {

  try {

    const { username } = req.params;

    const user = await User.findOne({

      username

    }).select(

      `
      username
      profileImage
      bio
      profession
      location
      github
      linkedin
      portfolio
      leetcodeUsername
      leetcodeUrl
      `
    );

    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found"

      });

    }

    return res.status(200).json({

      success: true,

      user

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};