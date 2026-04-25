import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  useEffect(() => {
    // Requirements: Extract token and email from URL query params
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('email');

    if (token) {
      console.log('Authenticating user:', email);
      
      // Store token in localStorage (handled inside loginUser via api.js)
      // Requirements: Decode JWT token to extract user role
      // Role claim key: http://schemas.microsoft.com/ws/2008/06/identity/claims/role
      const userData = loginUser(token);
      
      if (userData && userData.role) {
        const role = String(userData.role).toLowerCase().trim();
        
        // Requirements: Redirect user based on role
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'student') {
          navigate('/student-dashboard');
        } else if (role === 'applicant') {
          navigate('/applicant-dashboard');
        } else {
          // Default fallback for other roles like Staff
          navigate('/staff-dashboard');
        }
      } else {
        navigate('/auth');
      }
    } else {
      console.error('No token found in callback');
      navigate('/auth');
    }
  }, [location, loginUser, navigate]);

  return (
    <div className="auth-container" style={{ background: '#f8fafc', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Loader2 className="animate-spin" style={{ color: '#4f46e5' }} size={48} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Logging in...</h2>
        <p style={{ color: '#64748b' }}>Please wait while we verify your Google account.</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
