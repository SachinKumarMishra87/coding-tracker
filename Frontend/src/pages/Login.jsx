import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      toast.success(data.message || "Login successful", {
        style: {
          background: "#111315",
          color: "#fff",
          border: "1px solid #374151"
        }
      });
      navigate("/profile");

    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong", {
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

      {/* Back */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition text-sm"
      >
        ← Back to Home
      </button>

      {/* Card */}
      <div className="w-full max-w-md bg-[#0F252B] p-8 rounded-xl shadow-2xl border border-gray-800">

        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500/20 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500/20 outline-none"
          />

          <div className="flex justify-end">
            <Link
              to="/reset-password"
              className="text-sm text-blue-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-md font-semibold transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
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
          href={`${import.meta.env.VITE_API_URL}/auth/google`}
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
        <p className="text-center mt-4 text-gray-400">
          Don't have an account?
          <Link to="/signup" className="text-blue-400 ml-1 hover:underline">
            Signup
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;