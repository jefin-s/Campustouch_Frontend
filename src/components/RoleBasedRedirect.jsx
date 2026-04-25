import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium animate-pulse">Verifying access...</p>
        </div>
      </div>
    );
  }


  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const role = user.role?.toLowerCase();
  
  if (role === 'admin') return <Navigate to="/admin-dashboard" replace />;
  if (role === 'student') return <Navigate to="/student-dashboard" replace />;
  if (role === 'staff') return <Navigate to="/staff-dashboard" replace />;
  if (role === 'applicant') return <Navigate to="/applicant-dashboard" replace />;

  return <Navigate to="/unauthorized" replace />;
};

export default RoleBasedRedirect;
