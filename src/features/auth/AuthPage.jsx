import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  GraduationCap, 
  ShieldCheck, 
  Zap,
  Globe,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Phone,
  AtSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login, register, initiateGoogleLogin } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { getApiMessage } from '../../utils/apiMessage';

// Validation Schemas
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const registerSchema = Yup.object().shape({
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
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
  };

  return (
    <div className="min-h-screen bg-[var(--canvas-parchment)] text-[var(--ink)] font-inter selection:bg-[var(--primary)]/10 selection:text-[var(--primary)] overflow-hidden relative flex items-center justify-center py-16">
      {/* Background Abstract Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)]/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--surface-tile-2)]/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[var(--primary)]/5 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <LoginView key="login" onToggle={toggleMode} />
          ) : (
            <RegisterView key="register" onToggle={toggleMode} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const LoginView = ({ onToggle }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      
      const loginPromise = async () => {
        const responseData = await login(values.email, values.password);
        const user = loginUser(responseData.token, responseData.roles);
        
        const userRole = user?.role?.toLowerCase() || '';
        if (userRole === 'admin') navigate('/admin-dashboard');
        else if (userRole === 'student') navigate('/student-dashboard');
        else if (userRole === 'staff') navigate('/staff-dashboard');
        else if (userRole === 'applicant') navigate('/applicant-dashboard');
        else navigate('/');
        
        return responseData;
      };

      toast.promise(loginPromise(), {
        loading: 'Signing in...',
        success: 'Welcome back to CampusERP!',
        error: (err) => getApiMessage(err, 'Login failed. Please check your credentials.'),
      }).finally(() => {
        setIsLoading(false);
      });
    },
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="grid lg:grid-cols-2 gap-12 items-center"
    >
      {/* Left Side: Branding & Stats */}
      <div className="hidden lg:block space-y-12">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[var(--primary)]/20">
            <GraduationCap size={28} />
          </div>
          <h1 className="text-3xl font-noto font-semibold tracking-tight">
            Campus<span className="text-[var(--primary)]">ERP</span>
          </h1>
        </div>

        <div className="space-y-6">
            <h2 className="text-6xl font-noto font-semibold leading-[1.1] tracking-tight text-[var(--ink)]">
            Welcome Back to <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--primary-focus)]">CampusERP</span>
          </h2>
            <p className="text-xl text-[var(--ink-muted-80)] font-normal leading-relaxed max-w-lg">
            Manage your entire campus ecosystem with our enterprise-grade platform. Students, faculty, and operations in one place.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative group max-w-md"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#094cb2] to-[#3366cc] rounded-[32px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <div className="bg-[var(--canvas)]/90 p-8 lg:p-10 rounded-lg shadow-xl border border-[var(--hairline)]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[var(--ink-muted-48)] font-semibold text-xs uppercase tracking-widest mb-1">System Health</p>
                <h4 className="text-2xl font-noto font-semibold text-[var(--ink)] tracking-tight">Trusted by 100+ Colleges</h4>
              </div>
              <CheckCircle2 className="text-[var(--primary)]" size={32} />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold text-[#1b1c1d]/60">
                <span>Migration Progress</span>
                <span>94%</span>
              </div>
              <div className="h-3 rounded-full bg-[#f5f3f4] overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "94%" }}
                   transition={{ duration: 1.5, delay: 0.5 }}
                   className="h-full bg-gradient-to-r from-[#094cb2] to-[#3366cc] rounded-full"
                ></motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Login Form Card */}
      <div className="flex justify-center lg:justify-end">
        <div className="w-full max-w-[520px]">
          <div className="bg-[var(--canvas)]/90 p-8 lg:p-10 rounded-lg shadow-md border border-[var(--hairline)]">
            <div className="mb-10">
              <h3 className="text-3xl font-noto font-semibold text-[var(--ink)] tracking-tight mb-3">Sign In</h3>
              <p className="text-[var(--ink-muted-80)] font-normal">Enter your credentials to access your dashboard.</p>
            </div>

            <button 
              onClick={initiateGoogleLogin}
              className="w-full bg-white border border-[#c3c6d5]/50 hover:border-[#094cb2]/40 hover:bg-[#faf9fa] transition-all duration-300 py-4 rounded-xl font-semibold flex items-center justify-center gap-4 text-[#1b1c1d]/80 shadow-sm mb-8"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-[1px] bg-[#c3c6d5]/40"></div>
              <span className="text-[#1b1c1d]/40 font-bold text-xs uppercase tracking-widest">or continue with email</span>
              <div className="flex-1 h-[1px] bg-[#c3c6d5]/40"></div>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#1b1c1d]/80 mb-2 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1b1c1d]/30 group-focus-within:text-[#094cb2] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="name@college.edu" 
                    {...formik.getFieldProps('email')}
                    className={`w-full bg-white border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-[#c3c6d5]/50'} focus:border-[#094cb2] focus:ring-4 focus:ring-[#094cb2]/10 transition-all outline-none py-3.5 pl-11 pr-5 rounded-xl font-medium text-sm text-[#1b1c1d]`}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <div className="text-[#ff3b30] text-[11px] mt-1.5 ml-1 font-medium">{formik.errors.email}</div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between mb-2 px-1">
                  <label className="block text-sm font-semibold text-[#1b1c1d]/80">Password</label>
                  <a href="#" className="text-xs font-semibold text-[#094cb2] hover:text-[#3366cc] transition-colors">Forgot password?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1b1c1d]/30 group-focus-within:text-[#094cb2] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    name="password"
                    placeholder="••••••••" 
                    {...formik.getFieldProps('password')}
                    className={`w-full bg-white border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-[#c3c6d5]/50'} focus:border-[#094cb2] focus:ring-4 focus:ring-[#094cb2]/10 transition-all outline-none py-3.5 pl-11 pr-5 rounded-xl font-medium text-sm text-[#1b1c1d]`}
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-[#ff3b30] text-[11px] mt-1.5 ml-1 font-medium">{formik.errors.password}</div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-focus)] text-white py-4 rounded-xl font-semibold text-sm shadow-lg shadow-[var(--primary)]/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In to Platform'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[#1b1c1d]/60 font-medium text-sm">
                Don't have an account?{' '}
                <button 
                  onClick={onToggle}
                  className="text-[var(--primary)] font-semibold hover:text-[var(--primary-focus)] transition-colors inline-flex items-center gap-1"
                >
                  Create Account <ChevronRight size={16} />
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RegisterView = ({ onToggle }) => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      username: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
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
        
        setTimeout(() => {
          onToggle();
        }, 1500);
        
        return response;
      };

      toast.promise(registerPromise(), {
        loading: 'Creating your account...',
        success: 'Registration successful! Redirecting to sign in...',
        error: (err) => getApiMessage(err, 'Registration failed. Please check your details.'),
      }).finally(() => {
        setIsLoading(false);
      });
    },
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center"
    >
      <div className="w-full max-w-[680px]">
        <div className="ui-panel p-8 lg:p-10 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.18)]">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[var(--primary)] rounded-[18px] flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20 mx-auto mb-6">
              <GraduationCap size={32} />
            </div>
            <h3 className="text-3xl font-noto font-semibold text-[var(--ink)] tracking-tight mb-3">Create Your Account</h3>
            <p className="text-sm text-[var(--ink-muted-80)] font-normal max-w-md mx-auto">Join CampusERP and start managing your institution with modern tools.</p>
          </div>

          <button 
            onClick={initiateGoogleLogin}
            className="w-full bg-white border border-[#c3c6d5]/50 hover:border-[#094cb2]/40 hover:bg-[#faf9fa] transition-all duration-300 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-4 text-[#1b1c1d]/80 shadow-sm mb-8"
          >
            <GoogleIcon />
            Sign up with Google
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-[1px] bg-[#c3c6d5]/40"></div>
            <span className="text-[#1b1c1d]/40 font-bold text-xs uppercase tracking-widest">or sign up with email</span>
            <div className="flex-1 h-[1px] bg-[#c3c6d5]/40"></div>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1b1c1d]/80 px-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1b1c1d]/30 group-focus-within:text-[#094cb2] transition-colors">
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    name="fullName"
                    placeholder="John Doe" 
                    {...formik.getFieldProps('fullName')}
                    className={`w-full bg-white border ${formik.touched.fullName && formik.errors.fullName ? 'border-red-500' : 'border-[#c3c6d5]/50'} focus:border-[#094cb2] focus:ring-4 focus:ring-[#094cb2]/10 transition-all outline-none py-3.5 pl-11 pr-4 rounded-xl font-medium text-sm text-[#1b1c1d]`}
                  />
                </div>
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className="text-[#ff3b30] text-[11px] mt-1.5 ml-1 font-medium">{formik.errors.fullName}</div>
                )}
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1b1c1d]/80 px-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1b1c1d]/30 group-focus-within:text-[#094cb2] transition-colors">
                    <AtSign size={18} />
                  </div>
                  <input 
                    type="text" 
                    name="username"
                    placeholder="johndoe123" 
                    {...formik.getFieldProps('username')}
                    className={`w-full bg-white border ${formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-[#c3c6d5]/50'} focus:border-[#094cb2] focus:ring-4 focus:ring-[#094cb2]/10 transition-all outline-none py-3.5 pl-11 pr-4 rounded-xl font-medium text-sm text-[#1b1c1d]`}
                  />
                </div>
                {formik.touched.username && formik.errors.username && (
                  <div className="text-[#ff3b30] text-[11px] mt-1.5 ml-1 font-medium">{formik.errors.username}</div>
                )}
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1b1c1d]/80 px-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1b1c1d]/30 group-focus-within:text-[#094cb2] transition-colors">
                    <Phone size={18} />
                  </div>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    placeholder="+1 (555) 000-0000" 
                    {...formik.getFieldProps('phoneNumber')}
                    className={`w-full bg-white border ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-red-500' : 'border-[#c3c6d5]/50'} focus:border-[#094cb2] focus:ring-4 focus:ring-[#094cb2]/10 transition-all outline-none py-3.5 pl-11 pr-4 rounded-xl font-medium text-sm text-[#1b1c1d]`}
                  />
                </div>
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <div className="text-[#ff3b30] text-[11px] mt-1.5 ml-1 font-medium">{formik.errors.phoneNumber}</div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1b1c1d]/80 px-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1b1c1d]/30 group-focus-within:text-[#094cb2] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="john@college.edu" 
                    {...formik.getFieldProps('email')}
                    className={`w-full bg-white border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-[#c3c6d5]/50'} focus:border-[#094cb2] focus:ring-4 focus:ring-[#094cb2]/10 transition-all outline-none py-3.5 pl-11 pr-4 rounded-xl font-medium text-sm text-[#1b1c1d]`}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <div className="text-[#ff3b30] text-[11px] mt-1.5 ml-1 font-medium">{formik.errors.email}</div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1b1c1d]/80 px-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1b1c1d]/30 group-focus-within:text-[#094cb2] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    name="password"
                    placeholder="••••••••" 
                    {...formik.getFieldProps('password')}
                    className={`w-full bg-white border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-[#c3c6d5]/50'} focus:border-[#094cb2] focus:ring-4 focus:ring-[#094cb2]/10 transition-all outline-none py-3.5 pl-11 pr-4 rounded-xl font-medium text-sm text-[#1b1c1d]`}
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-[#ff3b30] text-[11px] mt-1.5 ml-1 font-medium">{formik.errors.password}</div>
                )}
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1b1c1d]/80 px-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1b1c1d]/30 group-focus-within:text-[#094cb2] transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="••••••••" 
                    {...formik.getFieldProps('confirmPassword')}
                    className={`w-full bg-white border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-[#c3c6d5]/50'} focus:border-[#094cb2] focus:ring-4 focus:ring-[#094cb2]/10 transition-all outline-none py-3.5 pl-11 pr-4 rounded-xl font-medium text-sm text-[#1b1c1d]`}
                  />
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className="text-[#ff3b30] text-[11px] mt-1.5 ml-1 font-medium">{formik.errors.confirmPassword}</div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-focus)] text-white py-4 rounded-xl font-semibold text-sm shadow-lg shadow-[var(--primary)]/20 transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Create My Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#1b1c1d]/60 font-medium text-sm">
              Already have an account?{' '}
              <button 
                onClick={onToggle}
                className="text-[var(--primary)] font-semibold hover:text-[var(--primary-focus)] transition-colors inline-flex items-center gap-1"
              >
                Sign In Now <ChevronRight size={16} />
              </button>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default AuthPage;
