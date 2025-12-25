import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

const AccountsPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [msg, setMsg] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  /* ------------------ DATA NORMALIZATION ------------------ */
  const normalizeUserData = (apiData) => {
    // Handle different possible data structures from /api/me
    if (!apiData) return null;
    
    // If the API returns data in a nested structure
    if (apiData.data && typeof apiData.data === 'object') {
      return {
        name: apiData.data.name || apiData.data.user?.name || 'User',
        email: apiData.data.email || apiData.data.user?.email || 'No email',
        contact: apiData.data.contact || apiData.data.phone || apiData.data.mobile || 'No contact',
        address: apiData.data.address || apiData.data.user?.address || 'No address set'
      };
    }
    
    // If the API returns flat data structure
    return {
      name: apiData.name || apiData.user?.name || 'User',
      email: apiData.email || apiData.user?.email || 'No email',
      contact: apiData.contact || apiData.phone || apiData.mobile || 'No contact',
      address: apiData.address || apiData.user?.address || 'No address set'
    };
  };

  useEffect(() => {
    const checkAuthAndFetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        
        if (!token) {
          throw new Error("No auth token - please login first");
        }
        
        // Call /api/me with Bearer token
        const response = await axios.get("/api/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        
        console.log("User info from /api/me:", response.data);
        const normalizedData = normalizeUserData(response.data);
        console.log("Normalized user data:", normalizedData);
        setUserInfo(normalizedData);
      } catch (error) {
        console.error("Authentication failed:", error);
        console.error("Error response:", error.response);
        setMsg("Failed to fetch user information. Please login again.");
        // Redirect to login after a delay
        setTimeout(() => {
          navigate("/login?redirectTo=" + encodeURIComponent("/accountsPage"));
        }, 2000);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthAndFetchUserInfo();
  }, [navigate]);

  if (isCheckingAuth) {
    return <p>Checking authentication...</p>;
  }

  if (msg) {
    return <p style={{ color: "red" }}>{msg}</p>;
  }

  if (!userInfo) {
    return <p>Loading your info...</p>;
  }

  return (
    <div className="">
      <div className="flex items-center">
        <div>
          <img src="/asset/images/user.png" alt="" className="w-22 mt-1" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-600">
            Hey, {userInfo.name}
          </h2>
          <p className="flex text-gray-500 text-sm">
            Email: {userInfo.email}, Phone: {userInfo.contact}{" "}
            <FaPencilAlt className="ml-3" />
          </p>
        </div>
      </div>
      <div className="border-t border-gray-300 mt-2 w-full" />
      <div className="py-5">
        <div className=" border border-gray-300 bg-gray-100 w-1/3 h-18 rounded-md flex flex-col items-center justify-center">
          <p className="flex items-center text-gray-500">
            <FaMapMarkerAlt className="text-gray-400" /> {userInfo.address}
          </p>
        </div>
        <div className="border border-gray-300 bg-gray-100 w-1/6 mt-5 rounded-md flex flex-col items-center justify-center">
          <p className="flex items-center text-gray-500 py-1 text-sm ">
            + ADD NEW ADDRESS
          </p>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-2 w-full" />
    </div>
  );
};

export default AccountsPage;
