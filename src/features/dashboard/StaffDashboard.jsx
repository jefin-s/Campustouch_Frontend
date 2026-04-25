import React from 'react';
import { LayoutDashboard, Users, Book, FileCheck, LogOut } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  const staffSidebar = (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">CT</div>
        <span>CampusTouch</span>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-item active"><LayoutDashboard size={20} /><span>Dashboard</span></div>
        <div className="nav-item"><Users size={20} /><span>My Students</span></div>
        <div className="nav-item"><Book size={20} /><span>Classes</span></div>
        <div className="nav-item"><FileCheck size={20} /><span>Grading</span></div>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );

  return (
    <DashboardLayout title="Staff Dashboard" roleColor="#f59e0b" sidebar={staffSidebar}>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Assigned Classes</div>
          <div className="stat-value">6</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Student Count</div>
          <div className="stat-value">180</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Leaves Taken</div>
          <div className="stat-value">2</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Reviews</div>
          <div className="stat-value">12</div>
        </div>
      </div>

      <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', padding: '40px', borderRadius: '24px', color: 'white', marginTop: '32px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Faculty Portal</h2>
        <p style={{ opacity: 0.9, maxWidth: '600px' }}>Access your teaching schedule, manage student grades, and coordinate with other faculty members.</p>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
