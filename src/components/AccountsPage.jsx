import React, { useEffect, useState } from "react";
import { 
  FaUser, 
  FaArrowLeft, 
  FaShoppingBag, 
  FaCreditCard, 
  FaSignOutAlt, 
  FaGlobe, 
  FaUsers, 
  FaQuestionCircle, 
  FaChevronRight,
  FaEdit,
  FaShieldAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccountsPage = () => {
  const [userInfo, setUserInfo] = useState(null);
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
    const user = apiData.data || apiData.user || apiData;
    return {
      name: user.name || 'User',
      firstName: (user.name || '').split(' ')[0] || '',
      lastName: (user.name || '').split(' ').slice(1).join(' ') || '',
      email: user.email || '',
      contact: user.contact || user.phone || user.mobile || '',
      address: user.address || 'No address set',
      gender: user.gender || 'Male'
    };
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("No token");
        const response = await axios.get("/api/me", {
          headers: { "Authorization": `Bearer ${token}` },
          withCredentials: true,
        });
        const normalized = normalizeUserData(response.data);
        setUserInfo(normalized);
        setFormData({
          firstName: normalized.firstName,
          lastName: normalized.lastName,
          email: normalized.email,
          contact: normalized.contact,
          gender: normalized.gender
        });
      } catch (error) {
        console.error("Auth error:", error);
        toast.error("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    fetchUserInfo();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        headers: { "Authorization": `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success("Profile updated successfully!");
      setUserInfo(prev => ({ 
        ...prev, 
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.contact 
      }));
      setShowEditForm(false);
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    toast.info("Logged out successfully");
    setTimeout(() => navigate("/login"), 1000);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#941007]/20 border-t-[#941007] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: "Account Settings",
      items: [
        { icon: FaUser, label: 'Edit Profile', desc: 'Update your personal details', action: () => setShowEditForm(true), color: 'text-blue-500', bg: 'bg-blue-50' },
        { icon: FaCreditCard, label: 'Payment Methods', desc: 'Manage your cards and wallets', action: () => navigate('/payment-methods'), color: 'text-purple-500', bg: 'bg-purple-50' },
        { icon: FaGlobe, label: 'Language', desc: 'English (US)', action: () => navigate('/language'), color: 'text-emerald-500', bg: 'bg-emerald-50' },
      ]
    },
    {
      title: "Activity",
      items: [
        { icon: FaShoppingBag, label: 'Order History', desc: 'View and track your orders', action: () => navigate('/orders'), color: 'text-orange-500', bg: 'bg-orange-50' },
        { icon: FaUsers, label: 'Invite Friends', desc: 'Get $20 for every referral', action: () => navigate('/invite-friends'), color: 'text-pink-500', bg: 'bg-pink-50' },
      ]
    },
    {
      title: "Support & Security",
      items: [
        { icon: FaShieldAlt, label: 'Privacy & Security', desc: 'Manage password and 2FA', action: () => navigate('/security'), color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { icon: FaQuestionCircle, label: 'Help Center', desc: 'FAQs and contact support', action: () => navigate('/help-center'), color: 'text-cyan-500', bg: 'bg-cyan-50' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      <ToastContainer position="top-right" autoClose={2000} />
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-[#941007]/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Sticky Header */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <span className="font-bold text-gray-900">Account</span>
          <button 
            onClick={handleLogout}
            className="p-2 text-[#941007] hover:bg-red-50 rounded-full transition-all active:scale-90"
            title="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-2xl mx-auto px-4 pt-8 text-left">
        
        {/* Premium Profile Card */}
        <div className="relative group mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#941007]/10 to-blue-500/10 rounded-[32px] blur-2xl opacity-50 transition-opacity group-hover:opacity-100" />
          <div className="relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center overflow-hidden">
            
            {/* Online Status Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#941007] to-red-400">
                <div className="w-full h-full rounded-full bg-white p-1">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.name)}&background=f3f4f6&color=374151&bold=true&size=128`} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover shadow-inner"
                  />
                </div>
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full shadow-sm animate-pulse" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{userInfo?.name}</h2>
            <p className="text-gray-500 font-medium text-sm mb-6">{userInfo?.email}</p>
            
            <button 
              onClick={() => setShowEditForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-bold shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-95"
            >
              <FaEdit className="text-xs" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Account Options Sections */}
        <div className="space-y-10">
          {sections.map((section, sIdx) => (section.items && section.items.length > 0) && (
            <div key={sIdx} className="space-y-4">
              <h3 className="px-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                {section.title}
              </h3>
              <div className="space-y-3">
                {section.items.map((item, iIdx) => (
                  <button
                    key={iIdx}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-[24px] shadow-sm hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">{item.label}</h4>
                        <p className="text-gray-400 text-xs sm:text-sm font-medium">{item.desc}</p>
                      </div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-full text-gray-300 group-hover:text-gray-900 group-hover:bg-gray-100 transition-all">
                      <FaChevronRight size={12} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-xs font-medium mb-4 uppercase tracking-widest">Summit Home Appliances v2.4.0</p>
          <button 
            onClick={handleLogout}
            className="px-8 py-3 text-[#941007] font-bold text-sm rounded-full hover:bg-red-50 transition-colors active:scale-95"
          >
            Sign Out
          </button>
        </div>
      </main>

      {/* Glass Edit Modal */}
      {showEditForm && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowEditForm(false)} 
          />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Edit Details</h2>
              <button onClick={() => setShowEditForm(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900">
                ✕
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-1">First Name</label>
                  <input 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#941007] focus:bg-white outline-none transition-all text-sm font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-1">Last Name</label>
                  <input 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#941007] focus:bg-white outline-none transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-1">Email Address</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#941007] focus:bg-white outline-none transition-all text-sm font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-1">Phone Number</label>
                <input 
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#941007] focus:bg-white outline-none transition-all text-sm font-semibold"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 py-4 text-gray-500 font-bold text-sm hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateProfile}
                  disabled={isSaving}
                  className="flex-[2] py-4 bg-[#941007] text-white font-bold text-sm rounded-2xl shadow-xl shadow-red-100 hover:bg-black transition-all disabled:bg-gray-300 active:scale-95"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
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
