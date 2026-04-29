// import React, { useState, useEffect } from "react";
// import axios from "../axiosConfig";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Login = ({ setIsLoggedIn }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [sessionId, setSessionId] = useState("");

//   const navigate = useNavigate();
//   const location = useLocation();
//   const redirectTo =
//     new URLSearchParams(location.search).get("redirectTo") || "/";

//   /* ------------------ SESSION ID HANDLER ------------------ */
//   const getSessionId = () => {
//     // Extract session ID from cookies or localStorage
//     const cookies = document.cookie.split(';');
//     for (let cookie of cookies) {
//       const [name, value] = cookie.trim().split('=');
//       if (name === 'summithomeappliances-session') {
//         return value;
//       }
//     }
//     return null;
//   };

//   const getUserInfoWithSession = async (sessionIdParam = null) => {
//     try {
//       const sessionToUse = sessionIdParam || getSessionId();
//       if (!sessionToUse) {
//         throw new Error("No session ID available");
//       }

//       // Call /api/me endpoint with session ID
//       const response = await axios.get(`/api/me?session_id=${sessionToUse}`, {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true,
//       });

//       return response.data;
//     } catch (error) {
//       console.error("Error fetching user info with session:", error);
//       throw error;
//     }
//   };

//   /* ------------------ PAGE STYLES ------------------ */
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = `
//       * { box-sizing: border-box; }
//       body, html, #root {
//         margin: 0; padding: 0; height: 100%;
//         font-family: 'Poppins', sans-serif;
//         background-color: #121212;
//         color: #eee;
//       }
//       .login-container { display: flex; min-height: 100vh; width: 100%; }
//       .image-section {
//         flex: 1;
//         background-image: url('/asset/images/login.jpg');
//         background-size: cover;
//         background-position: center;
//         filter: brightness(0.75);
//       }
//       .form-section {
//         flex: 1;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         background-color: #fafafc;
//         padding: 2.5rem 3rem;
//       }
//       .form-card {
//         width: 100%;
//         max-width: 420px;
//         background: #fafafc;
//         border-radius: 14px;
//         padding: 2rem 2.5rem;
//         box-shadow: 0 8px 24px rgb(221 42 29 / 27%);
//         text-align: center;
//       }
//       .form-card h2 {
//         margin-bottom: 2rem;
//         font-weight: 700;
//         font-size: 2.25rem;
//         color: #dd2a1d;
//       }
//       .input-group { margin-bottom: 1.5rem; text-align: left; }
//       .input-group label {
//         margin-bottom: 0.5rem;
//         font-weight: 600;
//         color: #dd2a1d;
//         display: block;
//       }
//       .input-group input {
//         width: 100%;
//         padding: 0.75rem 1rem;
//         border-radius: 10px;
//         border: 2px solid #333;
//         background: #eee;
//         color: #333;
//       }
//       .input-group input:focus {
//         outline: none;
//         border-color: #dd2a1d;
//       }
//       .btn-login {
//         width: 100%;
//         padding: 1rem 0;
//         background-color: #dd2a1d;
//         border: none;
//         border-radius: 10px;
//         font-weight: 700;
//         font-size: 1.15rem;
//         color: #fff;
//         cursor: pointer;
//       }
//       .btn-login:hover { background-color: #e04d00; }
//       .register-link {
//         margin-top: 1.25rem;
//         display: block;
//         color: #dd2a1d;
//         font-weight: 600;
//         text-decoration: none;
//       }
//       .loading-text {
//         color: #dd2a1d;
//         font-weight: 600;
//         font-size: 1.3rem;
//         text-align: center;
//         margin-top: 2rem;
//       }
//       @media (max-width: 768px) {
//         .login-container { flex-direction: column; }
//         .image-section { height: 250px; }
//         .form-section { padding: 2rem 1.5rem; }
//         .form-card {
//           padding: 1.5rem;
//           box-shadow: none;
//           border-radius: 0;
//         }
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   /* ------------------ LOGIN STATUS CHECK ------------------ */
//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         // Try the new /api/me endpoint with session ID
//         const currentSessionId = getSessionId();
//         if (currentSessionId) {
//           const userInfo = await getUserInfoWithSession(currentSessionId);
//           if (userInfo) {
//             navigate("/");
//             return;
//           }
//         }

//         // Fallback to direct /api/me call
//         await axios.get("/api/me", { withCredentials: true });
//         navigate("/");
//       } catch (meError) {
//         // If /api/me fails, set loading to false to show login form
//         console.error("Authentication check failed:", meError);
//         setLoading(false);
//       }
//     };
//     checkLoginStatus();
//   }, [navigate]);

//   /* ------------------ LOGIN HANDLER ------------------ */
//   const handleLogin = async () => {
//     if (!email || !password) {
//       toast.error("Please fill in all fields!");
//       return;
//     }

//     try {
//       // Perform login
//       await axios.post(
//         "/api/login",
//         { email, password },
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );

//       // After successful login, try to get user info with session
//       try {
//         const currentSessionId = getSessionId();
//         if (currentSessionId) {
//           const userInfo = await getUserInfoWithSession(currentSessionId);
//           console.log("User info from /api/me:", userInfo);
//         }
//       } catch (sessionError) {
//         console.warn("Could not fetch user info with session, but login succeeded");
//       }

//       setIsLoggedIn(true);
//       toast.success("Login successful");

//       setTimeout(() => {
//         navigate(redirectTo);
//       }, 1000);
//     } catch (error) {
//       console.error("Login error:", error);

//       if (error.response?.data?.errors) {
//         const firstError = Object.values(error.response.data.errors)[0][0];
//         toast.error(firstError);
//       } else if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error("Invalid email or password");
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="login-container">
//         <p className="loading-text">Checking login status...</p>
//       </div>
//     );
//   }

//   return (
//     <main className="login-container">
//       <aside className="image-section" />

//       <section className="form-section">
//         <div className="form-card">
//           <h2>Welcome Back!</h2>

//           <div className="input-group">
//             <label>Email Address</label>
//             <input
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div className="input-group">
//             <label>Password</label>
//             <input
//               type="password"
//               placeholder="Your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <button className="btn-login" type="button" onClick={handleLogin}>
//             Login
//           </button>

//           <Link className="register-link" to="/register">
//             Don't have an account? Register
//           </Link>
//         </div>
//       </section>

//       <ToastContainer position="top-right" autoClose={3000} />
//     </main>
//   );
// };

// export default Login;
import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { downloadProductCatalog } from "../utils/productCatalog";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirectTo") || "/";
  const wantsCatalog = searchParams.get("catalog") === "1";

  // 🔹 Check already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        // Use stored token to verify login
        await axios.get("/api/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        setIsLoggedIn(true);
        if (wantsCatalog) {
          await downloadProductCatalog();
        }
        navigate(redirectTo);
      } catch (error) {
        console.log("Token verification failed, showing login form");
        localStorage.removeItem("auth_token");
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate, location.search, redirectTo, wantsCatalog, setIsLoggedIn]);

  // 🔹 Login handler
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        "/api/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Extract and store token
      const token = res.data.token || res.data.access_token;

      if (token) {
        localStorage.setItem("auth_token", token);
        // Set token in axios default headers for all future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      // Verify login with /api/me
      await axios.get("/api/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // Login successful
      setIsLoggedIn(true);
      toast.success("Login successful");

      if (wantsCatalog) {
        await downloadProductCatalog();
      }

      setTimeout(() => navigate(redirectTo), 800);
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0][0];
        toast.error(firstError);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginShell = (children) => (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <div className="pointer-events-none absolute -top-28 -left-28 z-0 h-[min(85vw,420px)] w-[min(85vw,420px)] rounded-full bg-gradient-to-br from-red-100/90 via-[#941007]/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-28 z-0 h-[min(85vw,420px)] w-[min(85vw,420px)] rounded-full bg-gradient-to-tl from-red-100/90 via-[#941007]/10 to-transparent blur-3xl" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:py-16">
        {children}
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );

  if (checkingAuth) {
    return loginShell(
      <p className="text-gray-600 font-semibold">Checking login status...</p>
    );
  }

  return loginShell(
    <div className="w-full max-w-md">
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          Welcome <span className="text-[#941007]">Back</span>
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-500 sm:text-base">
          Log in to your Summit account
        </p>
      </div>

      <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] sm:p-8">
        <div className="mb-5">
          <label className="mb-2 block pl-1 text-xs font-bold uppercase tracking-widest text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all focus:border-[#941007] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block pl-1 text-xs font-bold uppercase tracking-widest text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all focus:border-[#941007] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="mb-6 flex justify-end">
          <button
            type="button"
            className="text-[11px] font-bold uppercase tracking-wider text-[#941007] hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`mb-6 w-full rounded-xl py-3.5 font-bold text-white shadow-lg transition-all ${
            isLoading
              ? 'cursor-not-allowed bg-gray-300 shadow-none'
              : 'bg-[#941007] shadow-red-200 hover:bg-black active:scale-95'
          }`}
        >
          {isLoading ? 'Processing...' : 'Sign In'}
        </button>

        <div className="text-center">
          <span className="text-sm font-medium text-gray-400">New to Summit?</span>{' '}
          <Link to="/register" className="ml-1 text-sm font-bold text-[#941007] hover:underline">
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
