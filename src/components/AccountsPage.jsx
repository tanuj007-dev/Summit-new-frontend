// import React, { useEffect, useState } from "react";
// import { FaPencilAlt, FaMapMarkerAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import axios from "../axiosConfig";

// const AccountsPage = () => {
//   const [userInfo, setUserInfo] = useState(null);
//   const [msg, setMsg] = useState("");
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const navigate = useNavigate();

//   /* ------------------ DATA NORMALIZATION ------------------ */
//   const normalizeUserData = (apiData) => {
//     // Handle different possible data structures from /api/me
//     if (!apiData) return null;
    
//     // If the API returns data in a nested structure
//     if (apiData.data && typeof apiData.data === 'object') {
//       return {
//         name: apiData.data.name || apiData.data.user?.name || 'User',
//         email: apiData.data.email || apiData.data.user?.email || 'No email',
//         contact: apiData.data.contact || apiData.data.phone || apiData.data.mobile || 'No contact',
//         address: apiData.data.address || apiData.data.user?.address || 'No address set'
//       };
//     }
    
//     // If the API returns flat data structure
//     return {
//       name: apiData.name || apiData.user?.name || 'User',
//       email: apiData.email || apiData.user?.email || 'No email',
//       contact: apiData.contact || apiData.phone || apiData.mobile || 'No contact',
//       address: apiData.address || apiData.user?.address || 'No address set'
//     };
//   };

//   useEffect(() => {
//     const checkAuthAndFetchUserInfo = async () => {
//       try {
//         const token = localStorage.getItem("auth_token");
        
//         if (!token) {
//           throw new Error("No auth token - please login first");
//         }
        
//         // Call /api/me with Bearer token
//         const response = await axios.get("/api/me", {
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         });
        
//         console.log("User info from /api/me:", response.data);
//         const normalizedData = normalizeUserData(response.data);
//         console.log("Normalized user data:", normalizedData);
//         setUserInfo(normalizedData);
//       } catch (error) {
//         console.error("Authentication failed:", error);
//         console.error("Error response:", error.response);
//         setMsg("Failed to fetch user information. Please login again.");
//         // Redirect to login after a delay
//         setTimeout(() => {
//           navigate("/login?redirectTo=" + encodeURIComponent("/accountsPage"));
//         }, 2000);
//       } finally {
//         setIsCheckingAuth(false);
//       }
//     };

//     checkAuthAndFetchUserInfo();
//   }, [navigate]);

//   if (isCheckingAuth) {
//     return <p>Checking authentication...</p>;
//   }

//   if (msg) {
//     return <p style={{ color: "red" }}>{msg}</p>;
//   }

//   if (!userInfo) {
//     return <p>Loading your info...</p>;
//   }

//   return (
//     <div className="">
//       <div className="flex items-center">
//         <div>
//           <img src="/asset/images/user.png" alt="" className="w-22 mt-1" />
//         </div>
//         <div>
//           <h2 className="text-base font-semibold text-gray-600">
//             Hey, {userInfo.name}
//           </h2>
//           <p className="flex text-gray-500 text-sm">
//             Email: {userInfo.email}, Phone: {userInfo.contact}{" "}
//             <FaPencilAlt className="ml-3" />
//           </p>
//         </div>
//       </div>
//       <div className="border-t border-gray-300 mt-2 w-full" />
//       <div className="py-5">
//         <div className=" border border-gray-300 bg-gray-100 w-1/3 h-18 rounded-md flex flex-col items-center justify-center">
//           <p className="flex items-center text-gray-500">
//             <FaMapMarkerAlt className="text-gray-400" /> {userInfo.address}
//           </p>
//         </div>
//         <div className="border border-gray-300 bg-gray-100 w-1/6 mt-5 rounded-md flex flex-col items-center justify-center">
//           <p className="flex items-center text-gray-500 py-1 text-sm ">
//             + ADD NEW ADDRESS
//           </p>
//         </div>
//       </div>

//       <div className="border-t border-gray-300 mt-2 w-full" />
//     </div>
//   );
// };

// export default AccountsPage;
import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaMapMarkerAlt, FaUser, FaShoppingBag, FaAddressBook, FaCreditCard, FaLock, FaSignOutAlt, FaTruck, FaHeadset, FaWallet, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

const AccountsPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [msg, setMsg] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  /* ------------------ DATA NORMALIZATION ------------------ */
  const normalizeUserData = (apiData) => {
    if (!apiData) return null;
    if (apiData.data && typeof apiData.data === 'object') {
      return {
        name: apiData.data.name || apiData.data.user?.name || 'User',
        firstName: (apiData.data.name || apiData.data.user?.name || '').split(' ')[0] || '',
        lastName: (apiData.data.name || apiData.data.user?.name || '').split(' ').slice(1).join(' ') || '',
        email: apiData.data.email || apiData.data.user?.email || '',
        contact: apiData.data.contact || apiData.data.phone || apiData.data.mobile || '',
        address: apiData.data.address || apiData.data.user?.address || 'No address set',
        gender: apiData.data.gender || 'Male'
      };
    }
    return {
      name: apiData.name || apiData.user?.name || 'User',
      firstName: (apiData.name || apiData.user?.name || '').split(' ')[0] || '',
      lastName: (apiData.name || apiData.user?.name || '').split(' ').slice(1).join(' ') || '',
      email: apiData.email || apiData.user?.email || '',
      contact: apiData.contact || apiData.phone || apiData.mobile || '',
      address: apiData.address || apiData.user?.address || 'No address set',
      gender: apiData.gender || 'Male'
    };
  };

  useEffect(() => {
    const checkAuthAndFetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("No auth token - please login first");
        const response = await axios.get("/api/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        const normalizedData = normalizeUserData(response.data);
        setUserInfo(normalizedData);
      } catch (error) {
        setMsg("Failed to fetch user information. Please login again.");
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse font-medium">Checking authentication...</p>
      </div>
    );
  }

  if (msg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 font-medium bg-red-50 px-6 py-3 rounded-lg shadow-sm border border-red-100">{msg}</p>
      </div>
    );
  }

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-500 mb-2">
            <span className="hover:text-gray-700 cursor-pointer">Home</span> / <span className="text-gray-900 font-medium">My Account</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="space-y-2">
              <div className="flex items-center p-4 bg-yellow-400 text-gray-900 rounded-xl font-bold shadow-sm transition-all">
                <FaUser className="mr-3" /> Personal Information
              </div>
              <div className="flex items-center p-4 bg-white text-gray-600 rounded-xl hover:bg-gray-100 cursor-pointer transition-all">
                <FaShoppingBag className="mr-3 text-gray-400" /> My Orders
              </div>
              <div className="flex items-center p-4 bg-white text-gray-600 rounded-xl hover:bg-gray-100 cursor-pointer transition-all">
                <FaAddressBook className="mr-3 text-gray-400" /> Manage Address
              </div>
              <div className="flex items-center p-4 bg-white text-gray-600 rounded-xl hover:bg-gray-100 cursor-pointer transition-all">
                <FaCreditCard className="mr-3 text-gray-400" /> Payment Method
              </div>
              <div className="flex items-center p-4 bg-white text-gray-600 rounded-xl hover:bg-gray-100 cursor-pointer transition-all">
                <FaLock className="mr-3 text-gray-400" /> Password Manager
              </div>
              <div className="flex items-center p-4 bg-white text-red-500 rounded-xl hover:bg-red-50 cursor-pointer transition-all mt-4">
                <FaSignOutAlt className="mr-3" /> Logout
              </div>
            </div>
          </aside>

          {/* Right Content Area */}
          <main className="flex-grow">
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 md:p-10">
              
              {/* Profile Image Section */}
              <div className="flex flex-col items-center mb-10">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
                    <img 
                      src="/asset/images/user.png" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + userInfo.name }}
                    />
                  </div>
                  <button className="absolute bottom-1 right-1 bg-green-500 text-white p-2 rounded-full border-4 border-white shadow-lg hover:bg-green-600 transition-colors">
                    <FaCamera size={14} />
                  </button>
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-800">{userInfo.name}</h3>
                <p className="text-gray-500 text-sm">{userInfo.email}</p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">First Name *</label>
                  <input 
                    type="text" 
                    defaultValue={userInfo.firstName}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Last Name *</label>
                  <input 
                    type="text" 
                    defaultValue={userInfo.lastName}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                  <input 
                    type="email" 
                    defaultValue={userInfo.email}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
                  <input 
                    type="text" 
                    defaultValue={userInfo.contact}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Gender *</label>
                  <select 
                    defaultValue={userInfo.gender}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all appearance-none bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <button className="px-10 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-lg transition-transform active:scale-95">
                  Update Changes
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* Bottom Feature Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-12">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <FaTruck className="text-2xl text-green-600" />
            </div>
            <h4 className="font-bold text-gray-800">Free Shipping</h4>
            <p className="text-sm text-gray-500 mt-1">On all orders above $99</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
              <FaWallet className="text-2xl text-yellow-600" />
            </div>
            <h4 className="font-bold text-gray-800">Flexible Payment</h4>
            <p className="text-sm text-gray-500 mt-1">Multiple secure payment options</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <FaHeadset className="text-2xl text-green-600" />
            </div>
            <h4 className="font-bold text-gray-800">24x7 Support</h4>
            <p className="text-sm text-gray-500 mt-1">Get help anytime, anywhere</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;