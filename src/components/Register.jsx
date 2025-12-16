import React, { useState } from "react";
import axios from "../axiosConfig";
import { Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const [msg, setMsg] = useState("");

  const isValidPassword = (password) => {
    const pattern = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/;
    return pattern.test(password);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async () => {
    const { name, email, contact, address, password, confirmPassword, agreed } =
      form;

    if (!name || !email || !contact || !address || !password || !confirmPassword) {
      setMsg("Please fill all fields");
      return;
    }

    if (!agreed) {
      setMsg("Please agree to the Terms of Service");
      return;
    }

    if (!isValidPassword(password)) {
      setMsg(
        "Password must be at least 6 characters, include one uppercase letter and one special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "/userRegister.php",
        new URLSearchParams({
          name,
          email,
          contact,
          address,
          password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          withCredentials: true,
        }
      );

      const response = res.data;
      setMsg(response.message ?? "Something went wrong.");

      if (response.status === "success") {
        setForm({
          name: "",
          email: "",
          contact: "",
          address: "",
          password: "",
          confirmPassword: "",
          agreed: false,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Image / Promo */}
      <div className="hidden md:block md:w-1/2 bg-gray-100">
        <img
          src="/asset/images/login.jpg" // Update this path to your banner
          alt="Summit Promo"
          className="w-full h-screen object-cover"
        />
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center bg-[#f9f9f9]">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
            Create an Account
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              value={form.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              value={form.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="contact"
              placeholder="Contact Number"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              value={form.contact}
              onChange={handleChange}
            />

            <input
              type="text"
              name="address"
              placeholder="Address (House No, Area, City, Pincode)"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              value={form.address}
              onChange={handleChange}
            />
            <small className="text-xs text-gray-500">Enter full address separated by commas</small>

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              value={form.password}
              onChange={handleChange}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Repeat Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                name="agreed"
                checked={form.agreed}
                onChange={handleChange}
                className="accent-red-500"
              />
              <span>
                I agree to the{" "}
                <a href="#" className="text-red-600 underline">
                  Terms of Service
                </a>
              </span>
            </label>

            {msg && (
              <p className={`text-sm ${msg.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {msg}
              </p>
            )}

            <button
              type="button"
              onClick={handleRegister}
              className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
            >
              Register
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
    </div>
  );
};

export default Register;
