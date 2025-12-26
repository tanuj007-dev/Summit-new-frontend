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
import { FaUser, FaArrowLeft, FaShoppingBag, FaAddressBook, FaCreditCard, FaLock, FaSignOutAlt, FaTruck, FaHeadset, FaWallet, FaCamera, FaGlobe, FaUsers, FaQuestionCircle, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

const AccountsPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [msg, setMsg] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    gender: 'Male'
  });
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

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
        setFormData({
          firstName: normalizedData.firstName,
          lastName: normalizedData.lastName,
          email: normalizedData.email,
          contact: normalizedData.contact,
          gender: normalizedData.gender
        });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("auth_token");
      await axios.put("/api/me", {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.contact,
        gender: formData.gender
      }, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      alert("Profile updated successfully!");
      setShowEditForm(false);
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

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

  // Menu items for the profile
  const menuItems = [
    { icon: FaUser, label: 'Edit Profile', action: () => setShowEditForm(true) },
    { icon: FaCreditCard, label: 'Payment Method', action: () => navigate('/payment-methods') },
    { icon: FaGlobe, label: 'Language', action: () => navigate('/language') },
    { icon: FaShoppingBag, label: 'Order History', action: () => navigate('/orders') },
    { icon: FaUsers, label: 'Invite Friends', action: () => navigate('/invite-friends') },
    { icon: FaQuestionCircle, label: 'Help Center', action: () => navigate('/help-center') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Profile</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center mb-6">
          {/* Profile Image with Status */}
          <div className="relative inline-block mb-6">
            <div className="w-28 sm:w-32 h-28 sm:h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-md">
              <img 
                src="/asset/images/user.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + userInfo.name }}
              />
            </div>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-md"></div>
          </div>

          {/* User Info */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{userInfo.name}</h2>
          <p className="text-gray-600 text-sm sm:text-base">{userInfo.email}</p>
        </div>

        {/* Menu List */}
        <div className="space-y-2 mb-8">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <item.icon size={20} className="text-gray-700 sm:text-xl" />
                </div>
                <span className="text-gray-800 font-medium text-sm sm:text-base">{item.label}</span>
              </div>
              <FaChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all group mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <FaSignOutAlt size={20} className="text-red-600 sm:text-xl" />
            </div>
            <span className="text-red-600 font-medium text-sm sm:text-base">Logout</span>
          </div>
          <FaChevronRight size={16} className="text-red-400 group-hover:text-red-600 transition-colors" />
        </button>

        {/* Bottom Features - Desktop Only */}
        <div className="hidden sm:grid grid-cols-3 gap-8 border-t border-gray-200 pt-12">
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

      {/* Edit Profile Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-lg sm:shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button 
                onClick={() => setShowEditForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">First Name *</label>
                  <input 
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Last Name *</label>
                  <input 
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Email Address *</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Phone Number *</label>
                  <input 
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Gender *</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition-all appearance-none bg-white text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-all text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateProfile}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-full shadow-lg transition-transform active:scale-95 text-sm"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;