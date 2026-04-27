import { LayoutDashboard, User, BookOpen, GraduationCap, LogOut } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  const studentSidebar = (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">CT</div>
        <span>CampusTouch</span>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-item active"><LayoutDashboard size={20} /><span>Dashboard</span></div>
        <div className="nav-item"><User size={20} /><span>Profile</span></div>
        <div className="nav-item"><BookOpen size={20} /><span>My Courses</span></div>
        <div className="nav-item"><GraduationCap size={20} /><span>Grades</span></div>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );

  return (
    <DashboardLayout title="Student Dashboard" roleColor="#10b981" sidebar={studentSidebar}>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Current GPA</div>
          <div className="stat-value">3.8</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Attendance</div>
          <div className="stat-value">92%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Credits Earned</div>
          <div className="stat-value">64</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Tasks</div>
          <div className="stat-value">5</div>
        </div>
      </div>

      <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', padding: '40px', borderRadius: '24px', color: 'white', marginTop: '32px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Welcome back, Scholar!</h2>
        <p style={{ opacity: 0.9, maxWidth: '600px' }}>Your academic journey is looking great. Check your latest grades and upcoming assignments below.</p>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
