import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  GraduationCap,
  Loader2,
  AtSign,
  Phone,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login, register, initiateGoogleLogin } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { getApiMessage } from '../../utils/apiMessage';

// Validation Schemas
const signInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const signUpSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Full name is required'),
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9+]{10,15}$/, 'Invalid phone number')
    .required('Phone number is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const SignInModal = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: signInSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      
      const loginPromise = async () => {
        const responseData = await login(values.email, values.password);
        loginUser(responseData.token, responseData.roles);
        
        // Navigation and closing happens after the promise resolves
        setTimeout(() => {
          onClose();
          const user = loginUser(responseData.token, responseData.roles);
          const userRole = user?.role?.toLowerCase() || '';
          
          if (userRole === 'admin') navigate('/admin-dashboard');
          else if (userRole === 'student') navigate('/student-dashboard');
          else if (userRole === 'staff' || userRole === 'faculty') navigate('/staff-dashboard');
          else if (userRole === 'applicant') navigate('/applicant-dashboard');
          else navigate('/');
        }, 100);
        
        return responseData;
      };

      toast.promise(loginPromise(), {
        loading: 'Authenticating...',
        success: 'Welcome back to CampusTouch!',
        error: (err) => getApiMessage(err, 'Login failed. Please check your credentials.'),
      }).finally(() => {
        setIsLoading(false);
      });
    },
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-[480px] bg-white rounded-[18px] shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-[#f5f5f7] text-[#1d1d1f]/40 hover:bg-[#e8e8ed] hover:text-[#1d1d1f] transition-all z-10"
              onClick={onClose}
            >
              <X size={18} />
            </button>

            <div className="p-8 lg:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#0066cc] rounded-[14px] flex items-center justify-center text-white shadow-[rgba(0,102,204,0.3)_0_5px_20px] mx-auto mb-5">
                  <GraduationCap size={28} />
                </div>
                <h2 className="text-[28px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] text-[#1d1d1f] mb-1">
                  Welcome Back
                </h2>
                <p className="text-[14px] font-['SF Pro Text'] text-[#1d1d1f]/60">
                  Sign in to continue your journey
                </p>
              </div>

              {/* Google Sign In */}
              <button
                onClick={initiateGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-[#e0e0e0] py-3 rounded-full font-['SF Pro Text'] text-[14px] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all duration-200 mb-6"
              >
                <FaGoogle size={18} className="text-[#0066cc]" />
                Continue with Google
              </button>

              {/* Divider */}
              <div className="relative flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-[#e0e0e0]"></div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40">Or sign in with email</span>
                <div className="flex-1 h-px bg-[#e0e0e0]"></div>
              </div>

              {/* Form */}
              <form onSubmit={formik.handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 mb-1.5 tracking-[-0.12px]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d1d1f]/30" size={16} />
                    <input
                      type="email"
                      name="email"
                      placeholder="name@institution.edu"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-[#e0e0e0]'} rounded-full py-3 pl-11 pr-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] transition-all placeholder:text-[#1d1d1f]/30`}
                      {...formik.getFieldProps('email')}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-[#ff3b30] text-[11px] mt-1.5 ml-4 font-medium">{formik.errors.email}</div>
                  ) : null}
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 mb-1.5 tracking-[-0.12px]">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d1d1f]/30" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-[#e0e0e0]'} rounded-full py-3 pl-11 pr-12 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] transition-all placeholder:text-[#1d1d1f]/30`}
                      {...formik.getFieldProps('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1d1d1f]/40 hover:text-[#1d1d1f] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-[#ff3b30] text-[11px] mt-1.5 ml-4 font-medium">{formik.errors.password}</div>
                  ) : null}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#e0e0e0] text-[#0066cc] focus:ring-[#0066cc]/20 focus:ring-2 transition-all"
                    />
                    <span className="text-[13px] font-['SF Pro Text'] text-[#1d1d1f]/60">Remember me</span>
                  </label>
                  <a href="#" className="text-[13px] font-['SF Pro Text'] text-[#0066cc] hover:text-[#0071e3] transition-colors">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0066cc] text-white py-3 rounded-full font-['SF Pro Text'] text-[15px] font-semibold hover:scale-95 transition-transform duration-200 flex items-center justify-center gap-2 mt-4 shadow-[rgba(0,102,204,0.3)_0_4px_12px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Sign In <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-[13px] font-['SF Pro Text'] text-[#1d1d1f]/60">
                  Don't have an account?{' '}
                  <button
                    onClick={onSwitchToSignUp}
                    className="text-[#0066cc] font-semibold hover:text-[#0071e3] transition-colors"
                  >
                    Apply now
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const SignUpModal = ({ isOpen, onClose, onSwitchToSignIn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      username: '',
      phoneNumber: '',
      email: '',
      password: '',
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      
      const registerPromise = async () => {
        const response = await register({
          fullName: values.fullName,
          username: values.username,
          phoneNumber: values.phoneNumber,
          email: values.email,
          password: values.password
        });
        
        // Switch to sign in after success
        setTimeout(() => {
          onSwitchToSignIn();
        }, 1500);
        
        return response;
      };

      toast.promise(registerPromise(), {
        loading: 'Creating your account...',
        success: 'Registration successful! Redirecting to login...',
        error: (err) => getApiMessage(err, 'Registration failed. Please check your details.'),
      }).finally(() => {
        setIsLoading(false);
      });
    },
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-[560px] bg-white rounded-[18px] shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-[#f5f5f7] text-[#1d1d1f]/40 hover:bg-[#e8e8ed] hover:text-[#1d1d1f] transition-all z-10"
              onClick={onClose}
            >
              <X size={18} />
            </button>

            <div className="p-8 lg:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#0066cc] rounded-[14px] flex items-center justify-center text-white shadow-[rgba(0,102,204,0.3)_0_5px_20px] mx-auto mb-5">
                  <GraduationCap size={28} />
                </div>
                <h2 className="text-[28px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] text-[#1d1d1f] mb-1">
                  Create Account
                </h2>
                <p className="text-[14px] font-['SF Pro Text'] text-[#1d1d1f]/60">
                  Join our academic community today
                </p>
              </div>

              {/* Google Register */}
              <button
                onClick={initiateGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-[#e0e0e0] py-3 rounded-full font-['SF Pro Text'] text-[14px] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all duration-200 mb-6"
              >
                <FaGoogle size={18} className="text-[#0066cc]" />
                Register with Google
              </button>

              {/* Divider */}
              <div className="relative flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-[#e0e0e0]"></div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40">Or register with email</span>
                <div className="flex-1 h-px bg-[#e0e0e0]"></div>
              </div>

              {/* Form */}
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 mb-1.5 tracking-[-0.12px]">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d1d1f]/30" size={16} />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.fullName && formik.errors.fullName ? 'border-red-500' : 'border-[#e0e0e0]'} rounded-full py-3 pl-11 pr-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] transition-all placeholder:text-[#1d1d1f]/30`}
                      {...formik.getFieldProps('fullName')}
                    />
                  </div>
                  {formik.touched.fullName && formik.errors.fullName ? (
                    <div className="text-[#ff3b30] text-[11px] mt-1.5 ml-4 font-medium">{formik.errors.fullName}</div>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 mb-1.5 tracking-[-0.12px]">
                      Username
                    </label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d1d1f]/30" size={16} />
                      <input
                        type="text"
                        name="username"
                        placeholder="preferred_id"
                        className={`w-full bg-[#f5f5f7] border ${formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-[#e0e0e0]'} rounded-full py-3 pl-11 pr-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] transition-all placeholder:text-[#1d1d1f]/30`}
                        {...formik.getFieldProps('username')}
                      />
                    </div>
                    {formik.touched.username && formik.errors.username ? (
                      <div className="text-[#ff3b30] text-[11px] mt-1.5 ml-4 font-medium">{formik.errors.username}</div>
                    ) : null}
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 mb-1.5 tracking-[-0.12px]">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d1d1f]/30" size={16} />
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="+1 (555) 000-0000"
                        className={`w-full bg-[#f5f5f7] border ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-red-500' : 'border-[#e0e0e0]'} rounded-full py-3 pl-11 pr-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] transition-all placeholder:text-[#1d1d1f]/30`}
                        {...formik.getFieldProps('phoneNumber')}
                      />
                    </div>
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                      <div className="text-[#ff3b30] text-[11px] mt-1.5 ml-4 font-medium">{formik.errors.phoneNumber}</div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 mb-1.5 tracking-[-0.12px]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d1d1f]/30" size={16} />
                    <input
                      type="email"
                      name="email"
                      placeholder="name@institution.edu"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-[#e0e0e0]'} rounded-full py-3 pl-11 pr-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] transition-all placeholder:text-[#1d1d1f]/30`}
                      {...formik.getFieldProps('email')}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-[#ff3b30] text-[11px] mt-1.5 ml-4 font-medium">{formik.errors.email}</div>
                  ) : null}
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 mb-1.5 tracking-[-0.12px]">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d1d1f]/30" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a strong password"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-[#e0e0e0]'} rounded-full py-3 pl-11 pr-12 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] transition-all placeholder:text-[#1d1d1f]/30`}
                      {...formik.getFieldProps('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1d1d1f]/40 hover:text-[#1d1d1f] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-[11px] mt-1 ml-4">{formik.errors.password}</div>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0066cc] text-white py-3 rounded-full font-['SF Pro Text'] text-[15px] font-semibold hover:scale-95 transition-transform duration-200 flex items-center justify-center gap-2 mt-6 shadow-[rgba(0,102,204,0.3)_0_4px_12px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Create Account <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-[13px] font-['SF Pro Text'] text-[#1d1d1f]/60">
                  Already have an account?{' '}
                  <button
                    onClick={onSwitchToSignIn}
                    className="text-[#0066cc] font-semibold hover:text-[#0071e3] transition-colors"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};