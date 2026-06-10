import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const intervalRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // TIMER START
  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setTimer(60);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // STEP 1: SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", {
        style: {
          background: "#111315",
          color: "#fff",
          border: "1px solid #374151"
        }
      });
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters", {
        style: {
          background: "#111315",
          color: "#fff",
          border: "1px solid #374151"
        }
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/send-otp", {
        email: formData.email
      });

      toast.success(data.message || "OTP sent successfully", {
        style: {
          background: "#111315",
          color: "#fff",
          border: "1px solid #374151"
        }
      });

      setStep(2);
      startTimer();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending OTP", {
        style: {
          background: "#111315",
          color: "#fff",
          border: "1px solid #374151"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: VERIFY OTP + REGISTER
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await API.post("/auth/verify-otp", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: formData.otp
      });

      toast.success(data.message || "OTP verified successfully", {
        style: {
          background: "#111315",
          color: "#fff",
          border: "1px solid #374151"
        }
      });

      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed", {
        style: {
          background: "#111315",
          color: "#fff",
          border: "1px solid #374151"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);

      const { data } = await API.post("/auth/send-otp", {
        email: formData.email
      });

      toast.success(data.message || "OTP sent successfully", {
        style: {
          background: "#111315",
          color: "#fff",
          border: "1px solid #374151"
        }
      });

      startTimer();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP", {
        style: {
          background: "#111315",
          color: "#fff",
          border: "1px solid #374151"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1E1C] flex items-center justify-center text-white relative">

      {/* BACK */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-gray-400 hover:text-white text-sm"
      >
        ← Back to Home
      </button>

      <div className="w-full max-w-md bg-[#0F252B] p-8 rounded-2xl border border-gray-800">

        <h2 className="text-3xl font-bold text-center mb-2">
          Create Account 🚀
        </h2>

        <p className="text-center text-gray-400 mb-6">
          {step === 1 ? "Enter details" : "Verify OTP"}
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">

            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:border-green-400/20 focus:ring-2 focus:ring-green-500/20 transition"
              required
            />

            <input
              name="email"
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:border-blue-400/20 focus:ring-2 focus:ring-blue-400/20 transition"
              required
            />

            <input
              type="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:border-yellow-400/20 focus:ring-2 focus:ring-yellow-400/20 transition"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-white/20 transition"
              required
            />

            <button
              disabled={loading}
              className="w-full bg-green-600 p-3 rounded"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}
        {/* GOOGLE LOGIN */}

        <div className="relative my-5">

          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="bg-[#0F252B] px-3 text-gray-400">
              OR
            </span>
          </div>

        </div>

        <a
          href="http://localhost:5000/api/auth/google"
          className="
    w-full
    flex items-center justify-center gap-3

    bg-white
    text-black

    py-3 rounded-xl

    font-semibold

    hover:bg-gray-200
    transition-all duration-300
  "
        >

          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />

          Continue with Google

        </a>

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">

            <p className="text-sm text-gray-400">
              OTP sent to <span className="text-green-400">{formData.email}</span>
            </p>

            <input
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              maxLength={6}
              className="w-full p-3 text-center tracking-widest bg-gray-800 rounded focus:outline-none focus:border-green-400/20 focus:ring-2 focus:ring-green-400/20 transition"
              required
            />

            <button
              disabled={loading}
              className="w-full bg-green-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500/20 transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-center text-sm mt-2">

              {timer > 0 ? (
                <p className="text-gray-400">
                  Resend OTP in{" "}
                  <span className="text-green-400">{timer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-green-400 hover:underline"
                >
                  Resend OTP
                </button>
              )}

            </div>

          </form>
        )}

        <p className="text-center mt-6 text-gray-400">
          Already have account?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;