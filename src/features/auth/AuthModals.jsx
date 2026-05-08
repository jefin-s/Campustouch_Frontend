import React, { useState } from 'react';
import { Mail, Lock, User, AtSign, Phone, X, GraduationCap, Loader2 } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { login, register, initiateGoogleLogin } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AuthModals.css';

export const SignInModal = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const navigateByRole = (role) => {
    if (!role) {
      setError('Access Denied: No role assigned to this account.');
      return;
    }

    const normalizedRole = String(role).toLowerCase().trim();
    if (normalizedRole === 'admin' || normalizedRole === 'administrator') {
      navigate('/admin-dashboard');
    } else if (normalizedRole === 'student') {
      navigate('/student-dashboard');
    } else if (normalizedRole === 'staff' || normalizedRole === 'faculty') {
      navigate('/staff-dashboard');
    } else if (normalizedRole === 'applicant') {
      navigate('/applicant-dashboard');
    } else {
      setError(`Access Denied: Role '${role}' not recognized by the system.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const responseData = await login(formData.email, formData.password);
      const token = responseData?.token;
      
      // Robust role extraction from API response
      const rolesFromApi = responseData?.roles || 
                          responseData?.Roles || 
                          responseData?.role || 
                          responseData?.Role;
      
      if (token) {
        const userData = loginUser(token, rolesFromApi);
        if (userData && userData.role && userData.role !== 'Unknown') {
          navigateByRole(userData.role);
          onClose();
        } else {
          setError('Account verified, but no specific role was found.');
        }
      } else {
        setError('Login failed: Token not received.');
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        
        <div className="modal-body">
          <div className="modal-header">
            <div className="modal-logo-icon">
              <GraduationCap size={32} />
            </div>
            <h2 className="modal-title">Welcome Back</h2>
            <p className="modal-subtitle">Sign in to access your college portal</p>
          </div>

          <button className="modal-google-btn" onClick={initiateGoogleLogin}>
            <FaGoogle size={18} />
            <span>Continue with Google</span>
          </button>

          <div className="modal-divider">or</div>

          {error && <div className="error-msg">{error}</div>}

          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-input-group">
              <label>Email</label>
              <div className="modal-input-wrapper">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@college.edu"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="modal-input-group">
              <label>Password</label>
              <div className="modal-input-wrapper">
                <Lock size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="modal-form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password-link">Forgot password?</a>
            </div>

            <button type="submit" className="modal-submit-btn" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>
          </form>

          <div className="modal-footer">
            Don't have an account? <span className="modal-footer-link" onClick={onSwitchToSignUp}>Sign Up</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SignUpModal = ({ isOpen, onClose, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await register(formData);
      setSuccess('Registration successful! Redirecting to sign in...');
      
      // Keep isLoading true to prevent double clicks during transition
      setTimeout(() => {
        onSwitchToSignIn();
      }, 1500);
    } catch (err) {
      setIsLoading(false); // Only re-enable on error
      if (err.errors) {
        const firstError = Object.values(err.errors)[0][0];
        setError(firstError);
      } else {
        setError(typeof err === 'string' ? err : 'Registration failed');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content signup-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        
        <div className="modal-body">
          <div className="modal-header">
            <h2 className="modal-title">Create Account</h2>
            <p className="modal-subtitle">Join our college management system</p>
          </div>

          <button className="modal-google-btn" onClick={initiateGoogleLogin}>
            <FaGoogle size={18} />
            <span>Continue with Google</span>
          </button>

          <div className="modal-divider">or</div>

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="signup-grid">
              <div className="modal-input-group full-width">
                <label>Full Name</label>
                <div className="modal-input-wrapper">
                  <User size={18} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-input-group">
                <label>Username</label>
                <div className="modal-input-wrapper">
                  <AtSign size={18} />
                  <input
                    type="text"
                    name="username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-input-group">
                <label>Email</label>
                <div className="modal-input-wrapper">
                  <Mail size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@college.edu"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-input-group">
                <label>Phone Number</label>
                <div className="modal-input-wrapper">
                  <Phone size={18} />
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-input-group">
                <label>Password</label>
                <div className="modal-input-wrapper">
                  <Lock size={18} />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="modal-submit-btn" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
            </button>
          </form>

          <div className="modal-footer">
            Already have an account? <span className="modal-footer-link" onClick={onSwitchToSignIn}>Sign In</span>
          </div>
        </div>
      </div>
    </div>
  );
};
