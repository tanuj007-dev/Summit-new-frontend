import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { toast } from 'react-toastify';
import adminimg from '../../components/assets/adminimage.png'
import { GiRiceCooker } from 'react-icons/gi';
const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await adminLogin(username, password);
      console.log('Admin Login Result:', result);
      
      if (result.success) {
       
        navigate('/admin');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Side - Image */}
        <div className="relative overflow-hidden">
          <img 
            src={adminimg} 
            alt="Admin Login"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FB923C;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23DC2626;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23grad)'/%3E%3Ctext x='400' y='300' font-family='Arial, sans-serif' font-size='48' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3EAdmin Panel%3C/text%3E%3C/svg%3E";
            }}
          />
          {/* <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white px-8">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Admin Panel</h1>
              <p className="text-lg lg:text-xl opacity-90">Manage your home appliances business with ease</p>
            </div>
          </div> */}
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              {/* Cooking Pot Icon */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                 <GiRiceCooker size={55} className='text-red-700' />
                  {/* Steam lines */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <div className="w-1 h-4 bg-gray-300 rounded-full opacity-60 animate-pulse"></div>
                  </div>
                  <div className="absolute -top-1 left-[calc(50%+8px)] -translate-x-1/2">
                    <div className="w-1 h-3 bg-gray-300 rounded-full opacity-40 animate-pulse delay-75"></div>
                  </div>
                  <div className="absolute -top-1 left-[calc(50%-8px)] -translate-x-1/2">
                    <div className="w-1 h-3 bg-gray-300 rounded-full opacity-40 animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h2>
              <p className="text-[16px] text-gray-600">Manage products, orders & inventory</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'LOGIN'}
                </button>
              </div>

              <div className="text-center pt-2">
                <a
                  href="#"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle forgot password logic here
                    toast.info('Forgot password functionality coming soon!');
                  }}
                >
                  Forgot Password?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
