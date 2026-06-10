import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [otp, setOtp] = useState("");
    const [verified, setVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [resetting, setResetting] = useState(false);

    const [resendTimer, setResendTimer] = useState(0);

    // SEND OTP
    const sendOtp = async () => {
        try {
            setSendingOtp(true);

            await API.post("/auth/forgot-password", { email });

            toast.success("OTP sent to email", {
                style: {
                    background: "#111315",
                    color: "#fff",
                    border: "1px solid #374151"
                }
            });

            setOtpSent(true);
            setResendTimer(30);

            const interval = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (err) {
            toast.error(err.response?.data?.message || "Error sending OTP", {
                style: {
                    background: "#111315",
                    color: "#fff",
                    border: "1px solid #374151"
                }
            });
        } finally {
            setSendingOtp(false);
        }
    };

    // VERIFY OTP
    const verifyOtp = async () => {
        try {
            setVerifyingOtp(true);

            await API.post("/auth/verify-forgot-otp", {
                email,
                otp,
            });
            toast.success("OTP verified", {
                style: {
                    background: "#111315",
                    color: "#fff",
                    border: "1px solid #374151"
                }
            });
            setVerified(true);

        } catch (err) {
            setVerified(false);
            toast.error(err.response?.data?.message || "Invalid OTP", {
                style: {
                    background: "#111315",
                    color: "#fff",
                    border: "1px solid #374151"
                }
            });
        } finally {
            setVerifyingOtp(false);
        }
    };

    // RESET PASSWORD
    const resetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match", {
                style: {
                    background: "#111315",
                    color: "#fff",
                    border: "1px solid #374151"
                }
            });
        }

        try {
            setResetting(true);

            await API.post("/auth/reset-password", {
                email,
                newPassword,
            });

            toast.success("Password reset successful", {
                style: {
                    background: "#111315",
                    color: "#fff",
                    border: "1px solid #374151"
                }
            });

            navigate("/login");

        } catch (err) {
            toast.error(err.response?.data?.message || "Error resetting password", {
                style: {
                    background: "#111315",
                    color: "#fff",
                    border: "1px solid #374151"
                }
            });
        } finally {
            setResetting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1C1E1C] flex items-center justify-center text-white">
            {/* Back */}
            <button
                onClick={() => navigate("/login")}
                className="absolute top-6 left-6 text-gray-400 hover:text-white transition text-sm"
            >
                ← Back to Login
            </button>
            <div className="w-full max-w-md bg-[#0F252B] p-8 rounded-xl shadow-2xl border border-gray-800">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Forgot Password 🔐
                </h2>

                {/* EMAIL + OTP BUTTON */}
                <div className="flex gap-2 mb-2">

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={otpSent || sendingOtp}
                        className="
                            flex-1 p-3 rounded-md
                            bg-gray-900
                            border border-gray-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500/20
                            focus:border-blue-500
                            transition
                        "
                    />

                    <button
                        onClick={sendOtp}
                        disabled={!email || otpSent || sendingOtp}
                        className={`
                            px-4 rounded-md font-semibold transition
                            flex items-center justify-center
                            ${sendingOtp ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {sendingOtp ? "Sending..." : "Send OTP"}
                    </button>

                </div>

                {/* OTP SENT STATUS */}
                {otpSent && (
                    <p className="text-green-400 text-xs mb-2">
                        ✔ OTP sent to email
                    </p>
                )}

                {/* RESEND */}
                {otpSent && !verified && (
                    <p
                        onClick={resendTimer === 0 ? sendOtp : undefined}
                        className={`text-xs mb-3 ${resendTimer === 0
                            ? "text-blue-400 cursor-pointer"
                            : "text-gray-500"
                            }`}
                    >
                        {resendTimer === 0
                            ? "Resend OTP"
                            : `Resend in ${resendTimer}s`}
                    </p>
                )}

                {/* OTP INPUT */}
                {otpSent && (
                    <div className="flex gap-2 mb-3">

                        <input
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="
                                flex-1 p-3 rounded-md
                                bg-gray-900
                                border border-gray-700
                                focus:outline-none
                               focus:ring-2
                                focus:ring-green-500/20
                                transition
                            "
                        />

                        <button
                            onClick={verifyOtp}
                            disabled={!otp || verified || verifyingOtp}
                            className={`
                                px-4 rounded-md font-semibold transition
                                ${verifyingOtp ? "bg-green-400" : "bg-green-600 hover:bg-green-700"}
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {verifyingOtp ? "Verifying..." : "Verify"}
                        </button>

                    </div>
                )}

                {/* VERIFIED */}
                {verified && (
                    <p className="text-green-400 text-sm mb-3">
                        ✔ OTP Verified
                    </p>
                )}

                {/* PASSWORD RESET */}
                {verified && (
                    <div className="space-y-3">

                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="
                                w-full p-3 rounded-md
                                bg-gray-900
                                border border-gray-700
                                focus:outline-none
                                focus:ring-2
                                focus:ring-purple-500/20
                                transition
                            "
                        />

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="
                                w-full p-3 rounded-md
                                bg-gray-900
                                border border-gray-700
                                focus:outline-none
                                focus:ring-2
                                focus:ring-purple-500/20
                                transition
                            "
                        />

                        <button
                            onClick={resetPassword}
                            disabled={!newPassword || !confirmPassword || resetting}
                            className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-md font-semibold transition disabled:opacity-50"
                        >
                            {resetting ? "Resetting..." : "Reset Password"}
                        </button>

                    </div>
                )}

            </div>
        </div>
    );
};

export default ForgotPassword;