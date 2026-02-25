import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../axiosConfig';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first for persisted auth state
    const storedAdmin = localStorage.getItem('adminAuth');
    if (storedAdmin) {
      const { admin: storedAdminData, timestamp } = JSON.parse(storedAdmin);
      // Check if the stored session is still valid (24 hours)
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        setAdmin(storedAdminData);
        setIsAdminLoggedIn(true);
        setIsLoading(false);
        return;
      } else {
        // Clear expired session
        localStorage.removeItem('adminAuth');
      }
    }
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const response = await axios.get('/CheckAdminLogin.php', {
        withCredentials: true,
      });
      if (response.data.loggedIn && response.data.admin) {
        setAdmin(response.data.admin);
        setIsAdminLoggedIn(true);
        // Persist to localStorage
        localStorage.setItem('adminAuth', JSON.stringify({
          admin: response.data.admin,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.error('Error checking admin auth:', error);
      setIsAdminLoggedIn(false);
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (username, password) => {
    try {
      console.log('Attempting admin login with:', { username, password });
      
      // Static admin credentials for testing
      const staticAdmin = {
        username: 'admin',
        password: 'admin123'
      };
      
      if (username === staticAdmin.username && password === staticAdmin.password) {
        console.log('Static admin login successful');
        const mockAdmin = {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          name: 'Administrator'
        };
        setAdmin(mockAdmin);
        setIsAdminLoggedIn(true);
        // Persist to localStorage
        localStorage.setItem('adminAuth', JSON.stringify({
          admin: mockAdmin,
          timestamp: Date.now()
        }));
        return { success: true };
      } else {
        console.log('Static admin login failed');
        return { success: false, message: 'Invalid credentials. Use admin/admin123' };
      }
      
      // Original API call (commented out for now)
      /*
      const response = await axios.post('/AdminLogin.php', {
        username,
        password,
      }, { withCredentials: true });

      console.log('Admin login response:', response.data);

      if (response.data.success) {
        setAdmin(response.data.admin);
        setIsAdminLoggedIn(true);
        return { success: true };
      } else {
        return { success: false, message: response.data.message || 'Login failed' };
      }
      */
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, message: 'Login failed' };
    }
  };

  const adminLogout = async () => {
    try {
      await axios.get('/AdminLogout.php', { withCredentials: true });
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      setAdmin(null);
      setIsAdminLoggedIn(false);
      // Clear localStorage
      localStorage.removeItem('adminAuth');
    }
  };

  const value = {
    admin,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    checkAdminAuth,
    isLoading,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
