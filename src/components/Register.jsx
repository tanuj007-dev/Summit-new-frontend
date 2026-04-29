import React, { useState } from "react";
import axios from "../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Relaxed validation (Laravel friendly)
  const isValidPassword = (password) => password.length >= 6;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async () => {
    const { name, email, password, confirmPassword, agreed } = form;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (!agreed) {
      toast.error("Please agree to the Terms of Service");
      return;
    }

    if (!isValidPassword(password)) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "/api/register",
        {
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success("Registration successful! Please login.");

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreed: false,
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Registration error:", error);

      // Laravel validation error handling
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0][0];
        toast.error(firstError);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute -top-28 -left-28 z-0 h-[min(85vw,420px)] w-[min(85vw,420px)] rounded-full bg-gradient-to-br from-red-100/90 via-[#941007]/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-28 z-0 h-[min(85vw,420px)] w-[min(85vw,420px)] rounded-full bg-gradient-to-tl from-red-100/90 via-[#941007]/10 to-transparent blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Join <span className="text-[#941007]">Summit</span>
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-500 sm:text-base">
              Create your account to start shopping
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] sm:p-8">
            <div className="space-y-5">
              {/* Name Input */}
              <div>
                <label className="mb-2 block pl-1 text-xs font-bold uppercase tracking-widest text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all focus:border-[#941007] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="mb-2 block pl-1 text-xs font-bold uppercase tracking-widest text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all focus:border-[#941007] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Password Container */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block pl-1 text-xs font-bold uppercase tracking-widest text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all focus:border-[#941007] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block pl-1 text-xs font-bold uppercase tracking-widest text-gray-700">
                    Confirm
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all focus:border-[#941007] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 text-xs font-medium text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreed"
                  checked={form.agreed}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#941007] focus:ring-[#941007] accent-[#941007]"
                />
                <span>
                  I agree to the{" "}
                  <span className="text-[#941007] font-bold hover:underline">Terms of Service</span> and acknowledge the Privacy Policy.
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleRegister}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${loading
                  ? 'bg-gray-300 cursor-not-allowed shadow-none'
                  : 'bg-[#941007] hover:bg-black active:scale-95 shadow-red-200'
                  }`}
              >
                {loading ? "Creating Account..." : "Register Now"}
              </button>

              {/* Sign In Link */}
              <div className="text-center pt-2">
                <span className="text-sm font-medium text-gray-400">Already have an account?</span>{' '}
                <Link to="/login" className="ml-1 text-sm font-bold text-[#941007] hover:underline">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Register;
