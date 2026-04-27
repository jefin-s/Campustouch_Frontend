import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();
  const [error, setError] = useState(null);
  const processingRef = useRef(false);

  useEffect(() => {
    // Guard to prevent double-processing (important for React 18 StrictMode)
    if (processingRef.current) return;
    
    const processLogin = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const email = queryParams.get('email');
        const errorParam = queryParams.get('error');

        if (errorParam) {
          setError(errorParam);
          return;
        }

        if (token) {
          processingRef.current = true;
          console.log('Finalizing login for:', email);
          
          const userData = loginUser(token);
          
          if (userData && userData.role) {
            const role = String(userData.role).toLowerCase().trim();
            
            // Navigate immediately
            if (role === 'admin') navigate('/admin-dashboard', { replace: true });
            else if (role === 'student') navigate('/student-dashboard', { replace: true });
            else if (role === 'applicant') navigate('/applicant-dashboard', { replace: true });
            else navigate('/staff-dashboard', { replace: true });
          } else {
            setError('Account verified, but your role could not be determined.');
          }
        } else {
          setError('No authentication token received from the server.');
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError('An unexpected error occurred during login.');
      }
    };

    processLogin();
  }, [location, loginUser, navigate]);

  return (
    <div className="auth-container" style={{ background: '#f8fafc', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '24px', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '24px',
        maxWidth: '450px',
        width: '90%',
        textAlign: 'center'
      }}>
        {!error ? (
          <>
            <div style={{ position: 'relative' }}>
              <Loader2 className="animate-spin" style={{ color: '#4f46e5' }} size={64} />
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                width: '12px',
                height: '12px',
                background: '#4f46e5',
                borderRadius: '50%'
              }}></div>
            </div>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>Finalizing Login</h2>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>We've verified your account. Redirecting you to your dashboard...</p>
            </div>
          </>
        ) : (
          <>
            <div style={{ background: '#fee2e2', padding: '20px', borderRadius: '50%' }}>
              <AlertCircle style={{ color: '#ef4444' }} size={48} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>Authentication Failed</h2>
              <p style={{ color: '#ef4444', fontSize: '1.1rem', marginBottom: '24px' }}>{error}</p>
              <button 
                onClick={() => navigate('/auth')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px',
                  background: '#4f46e5',
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <ArrowLeft size={18} />
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
