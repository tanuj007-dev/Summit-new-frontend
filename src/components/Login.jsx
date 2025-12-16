import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({setIsLoggedIn}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get("redirectTo") || "/";
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        box-sizing: border-box;
      }
      body, html, #root {
        margin: 0; padding: 0; height: 100%;
        font-family: 'Poppins', sans-serif;
        background-color: #121212;
        color: #eee;
      }
      .login-container {
        display: flex;
        min-height: 100vh;
        width: 100%;
      }
      .image-section {
        flex: 1;
        background-image: url('/asset/images/login.jpg');
        background-size: cover;
        background-position: center;
        filter: brightness(0.75);
      }
      .form-section {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fafafc;
        padding: 2.5rem 3rem;
      }
      .form-card {
        width: 100%;
        max-width: 420px;
        background: #fafafc;
        border-radius: 14px;
        padding: 2rem 2.5rem;
        box-shadow: 0 8px 24px rgb(221 42 29 / 27%);
        text-align: center;
      }
      .form-card h2 {
        margin-bottom: 2rem;
        font-weight: 700;
        font-size: 2.25rem;
        color: #dd2a1d;
        letter-spacing: 1px;
      }
      .input-group {
        margin-bottom: 1.5rem;
        text-align: left;
      }
      .input-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        font-size: 1rem;
        color: #dd2a1d;
      }
      .input-group input {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: 10px;
        border: 2px solid #333;
        background: #eee;
        color: #333;
        font-size: 1rem;
        transition: border-color 0.3s ease;
      }
      .input-group input::placeholder {
        color: #777;
      }
      .input-group input:focus {
        outline: none;
        border-color: #dd2a1d;
      }
      .btn-login {
        width: 100%;
        padding: 1rem 0;
        background-color: #dd2a1d;
        border: none;
        border-radius: 10px;
        font-weight: 700;
        font-size: 1.15rem;
        color: #fff;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin-top: 0.5rem;
      }
      .btn-login:hover {
        background-color: #e04d00;
      }
      .register-link {
        margin-top: 1.25rem;
        display: block;
        color: #dd2a1d;
        font-weight: 600;
        text-decoration: none;
        font-size: 0.95rem;
      }
      .register-link:hover {
        text-decoration: underline;
      }
      .loading-text {
        color: #dd2a1d;
        font-weight: 600;
        font-size: 1.3rem;
        text-align: center;
        margin-top: 2rem;
      }
      @media (max-width: 768px) {
        .login-container {
          flex-direction: column;
        }
        .image-section {
          height: 250px;
          width: 100%;
          filter: brightness(0.6);
        }
        .form-section {
          padding: 2rem 1.5rem;
        }
        .form-card {
          padding: 1.5rem 1.75rem;
          max-width: 100%;
          border-radius: 0;
          box-shadow: none;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await axios.get("/CheckLogin.php", { withCredentials: true });
        if (res.data.loggedIn) {
          navigate("/");
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      const res = await axios.post(
        "/userLogin.php",
        new URLSearchParams({ email, password }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );

      if (res.data.status === "success") {
        setIsLoggedIn(true);
        toast.success(res.data.message);
        setTimeout(() =>{
          window.location.href =  redirectTo || '/';
          // navigate(redirectTo || "/")
        }, 1000);

      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Something went wrong, try again.");
    }
  };

  if (loading) {
    return (
      <div className="login-container">
        <p className="loading-text">Checking login status...</p>
      </div>
    );
  }

  return (
    <main className="login-container" role="main" aria-label="Login form">
      <aside className="image-section" aria-hidden="true"></aside>

      <section className="form-section">
        <div className="form-card">
          <h2>Welcome Back!</h2>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="btn-login" onClick={handleLogin} type="button">
            Login
          </button>

          <Link className="register-link" to="/register" tabIndex={0}>
            Don't have an account? Register
          </Link>
        </div>
      </section>


    </main>
  );
};

export default Login;
