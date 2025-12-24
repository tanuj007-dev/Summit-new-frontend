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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Image */}
      <div className="hidden md:block md:w-1/2 bg-gray-100">
        <img
          src="/asset/images/login.jpg"
          alt="Summit Promo"
          className="w-full h-screen object-cover"
        />
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center bg-[#f9f9f9]">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border">
          <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
            Create an Account
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-400"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Repeat Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-400"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="agreed"
                checked={form.agreed}
                onChange={handleChange}
                className="accent-red-600"
              />
              <span>
                I agree to the{" "}
                <span className="text-red-600 underline cursor-pointer">
                  Terms of Service
                </span>
              </span>
            </label>

            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-red-600 underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Register;
