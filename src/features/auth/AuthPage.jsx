import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, GraduationCap, AtSign, Phone, Loader2 } from 'lucide-react';
import { FaFacebookF, FaGoogle, FaLinkedinIn } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginUser, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: ''
  });

  // Helper for case-insensitive role-based navigation
  const navigateByRole = (role) => {
    if (!role) return;
    
    const normalizedRole = String(role).toLowerCase().trim();
    
    if (normalizedRole === 'admin') navigate('/admin-dashboard');
    else if (normalizedRole === 'student') navigate('/student-dashboard');
    else if (normalizedRole === 'staff') navigate('/staff-dashboard');
    else if (normalizedRole === 'applicant') navigate('/applicant-dashboard');
    else {
      setError(`Access Denied: Role '${role}' not recognized.`);
    }
  };

  // Redirect if already logged in (e.g. on page load)
  useEffect(() => {
    if (user) {
      navigateByRole(user.role);
    }
  }, [user, navigate]);

  const toggleAuth = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      fullName: '',
      email: '',
      username: '',
      password: '',
      phoneNumber: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        const responseData = await login(formData.email, formData.password);
        // Based on your backend: { token: "...", roles: ["Admin"], ... }
        const token = responseData?.token;
        const rolesFromApi = responseData?.roles || responseData?.Roles;
        
        if (token) {
          const userData = loginUser(token, rolesFromApi);
          if (userData && userData.role && userData.role !== 'Unknown') {
            navigateByRole(userData.role);
          } else {
            setError('Account verified, but no specific role was found.');
          }
        } else {
          setError('Login failed: Token not received from server.');
        }
      } else {
        await register(formData);
        // After registration, maybe switch to login or auto-login
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      if (err.errors) {
        // Extract the first validation error message
        const firstError = Object.values(err.errors)[0][0];
        setError(firstError);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              className="auth-panel"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="auth-title">Sign In</h1>
              <div className="social-container">
                <button className="social-btn"><FaFacebookF size={20} /></button>
                <button className="social-btn"><FaGoogle size={20} /></button>
                <button className="social-btn"><FaLinkedinIn size={20} /></button>
              </div>
              <p className="auth-subtitle">or use your account</p>

              {error && <div className="error-message">{error}</div>}

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <Lock size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <a href="#" className="forgot-password">Forgot your password?</a>
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              className="auth-panel"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="auth-title">Create Account</h1>
              <div className="social-container">
                <button className="social-btn"><FaFacebookF size={20} /></button>
                <button className="social-btn"><FaGoogle size={20} /></button>
                <button className="social-btn"><FaLinkedinIn size={20} /></button>
              </div>
              <p className="auth-subtitle">or use your email for registration</p>

              {error && <div className={error.includes('successful') ? 'success-message' : 'error-message'}>{error}</div>}

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <User size={18} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <AtSign size={18} />
                  <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <Phone size={18} />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <Lock size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign Up'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="auth-panel overlay">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>

          <div className="auth-logo">
            <div className="auth-logo-icon">
              <GraduationCap size={24} />
            </div>
            <span>CampusTouch</span>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="overlay-login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="auth-title">Hello, Friend!</h2>
                <p className="auth-subtitle">Enter your personal details and start your journey with us</p>
                <button className="outline-btn" onClick={toggleAuth}>Sign Up</button>
              </motion.div>
            ) : (
              <motion.div
                key="overlay-register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="auth-title">Welcome Back!</h2>
                <p className="auth-subtitle">To keep connected with us please login with your personal info</p>
                <button className="outline-btn" onClick={toggleAuth}>Sign In</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;

