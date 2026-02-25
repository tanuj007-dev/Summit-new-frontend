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
    <div className="min-h-screen">
      {/* Desktop Layout - Image Left, Form Right */}
      <div className="hidden md:grid md:grid-cols-2 min-h-screen">
        {/* Left Section - Image */}
        <div
          className="bg-cover bg-center relative"
          style={{
            backgroundImage: "url('/asset/images/login.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>

        {/* Right Section - Register Form */}
        <div className="bg-white flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-extrabold text-red-600 text-center mb-4">
              Join Summit
            </h2>
            <p className="text-gray-500 text-center mb-10 font-medium">Create your account to start shopping.</p>

            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-widest pl-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-xl focus:outline-none focus:bg-white transition-all text-gray-800 text-sm font-semibold"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-widest pl-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-xl focus:outline-none focus:bg-white transition-all text-gray-800 text-sm font-semibold"
                />
              </div>

              {/* Password Container */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-widest pl-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-xl focus:outline-none focus:bg-white transition-all text-gray-800 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-widest pl-1">
                    Confirm
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Enter your password again"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-xl focus:outline-none focus:bg-white transition-all text-gray-800 text-sm font-semibold"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm font-medium text-gray-600 group cursor-pointer">
                <input
                  type="checkbox"
                  name="agreed"
                  checked={form.agreed}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-md border-2 border-gray-300 text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
                />
                <span>
                  I agree to the{" "}
                  <span className="text-red-600 font-bold hover:underline">
                    Terms of Service
                  </span>
                </span>
              </label>

              <button
                type="button"
                onClick={handleRegister}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${loading
                  ? 'bg-gray-300 cursor-not-allowed shadow-none'
                  : 'bg-red-600 hover:bg-black active:scale-95 shadow-red-200'
                  }`}
              >
                {loading ? "Creating Account..." : "Register Now"}
              </button>

              <p className="text-center text-gray-500 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-red-600 font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Only Form */}
      <div className="md:hidden min-h-screen bg-[#fcfcfc] flex flex-col items-center px-4 py-6 relative overflow-hidden">
        {/* Decorative elements for mobile */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="w-full max-w-sm relative z-10">
          <div className="mb-4 text-center">
            <Link to="/">
              <img
                src="/asset/images/LogoS.png"
                alt="Summit Logo"
                className="w-24 mx-auto mb-6 drop-shadow-sm"
              />
            </Link>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Create <span className="text-red-600">Account</span>
            </h2>
            <p className="text-gray-500 mt-2 text-sm font-medium">Join the Summit community today</p>
          </div>

          <div className="bg-white p-8 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100">
            <div className="space-y-5">
              {/* Name Input */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-widest pl-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-xl focus:outline-none focus:bg-white transition-all text-gray-800 text-sm font-semibold"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-widest pl-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-xl focus:outline-none focus:bg-white transition-all text-gray-800 text-sm font-semibold"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-widest pl-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-xl focus:outline-none focus:bg-white transition-all text-gray-800 text-sm font-semibold"
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-widest pl-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Enter your password again"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-xl focus:outline-none focus:bg-white transition-all text-gray-800 text-sm font-semibold"
                />
              </div>

              <label className="flex items-start gap-3 text-xs font-medium text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreed"
                  checked={form.agreed}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-red-600 focus:ring-red-500 accent-red-600"
                />
                <span>
                  I agree to the{" "}
                  <span className="text-red-600 font-bold">Terms of Service</span> and acknowledge the Privacy Policy.
                </span>
              </label>

              <button
                type="button"
                onClick={handleRegister}
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all ${loading
                  ? 'bg-gray-300 cursor-not-allowed shadow-none'
                  : 'bg-red-600 hover:bg-black active:scale-95 shadow-red-200'
                  }`}
              >
                {loading ? "Creating..." : "Sign Up"}
              </button>

              <div className="text-center">
                <span className="text-gray-400 text-sm font-medium">Already a member?</span>{' '}
                <Link to="/login" className="text-red-600 font-bold text-sm hover:underline ml-1">
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
