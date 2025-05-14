import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Load user
  const loadUser = async () => {
    try {
      setAuthToken(token);
      const res = await axios.get('/api/auth/me');
      setUser(res.data.user);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Verify OTP
  const verifyOTP = async (formData) => {
    try {
      const res = await axios.post('/api/auth/verify-otp', formData);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      await loadUser();
      toast.success('Account verified successfully');
      navigate('/profile');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
      throw err;
    }
  };

  // Login
  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login', formData);

      if (res.data.message === 'Account not verified. OTP sent to email.') {
        return res.data;
      }

      setToken(res.data.token);
      setAuthToken(res.data.token);
      await loadUser();
      toast.success('Logged in successfully');
      navigate('/profile');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      toast.success(res.data.message);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (formData) => {
    try {
      const res = await axios.put('/api/auth/reset-password', formData);
      toast.success(res.data.message);
      navigate('/login');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
      throw err;
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    navigate('/login');
  };

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        register,
        verifyOTP,
        login,
        forgotPassword,
        resetPassword,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;