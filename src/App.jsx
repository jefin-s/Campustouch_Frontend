import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './features/auth/LandingPage';
import GoogleCallback from './features/auth/GoogleCallback';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import AdminDashboard from './features/dashboard/AdminDashboard';
import StudentDashboard from './features/student/StudentDashboard';
import StaffDashboard from './features/staff/StaffDashboard';
import ApplicantDashboard from './features/dashboard/ApplicantDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/auth" element={<LandingPage />} />
          <Route path="/auth/callback" element={<GoogleCallback />} />
          
          {/* Smart Root Redirect */}
          <Route path="/" element={<RoleBasedRedirect />} />
          
          {/* Protected Dashboard Routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/applicant-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Applicant']}>
                <ApplicantDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback routes */}
          <Route path="/unauthorized" element={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
              <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#ef4444', margin: 0 }}>403</h1>
              <p style={{ fontSize: '1.25rem', color: '#475569', marginBottom: '20px' }}>Unauthorized Access</p>
              <button 
                onClick={() => window.location.href = '/'}
                style={{ padding: '10px 24px', backgroundColor: '#4f46e5', color: 'white', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
              >
                Go Home
              </button>
            </div>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


