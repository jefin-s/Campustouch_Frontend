import { LayoutDashboard, FileText, Upload, HelpCircle, LogOut } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ApplicantDashboard = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  const applicantSidebar = (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">CT</div>
        <span>CampusTouch</span>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-item active"><LayoutDashboard size={20} /><span>Status</span></div>
        <div className="nav-item"><FileText size={20} /><span>Application</span></div>
        <div className="nav-item"><Upload size={20} /><span>Documents</span></div>
        <div className="nav-item"><HelpCircle size={20} /><span>Support</span></div>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );

  return (
    <DashboardLayout title="Applicant Dashboard" roleColor="#6366f1" sidebar={applicantSidebar}>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Application Status</div>
          <div className="stat-value">Under Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Documents Verified</div>
          <div className="stat-value">4/5</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Interview Date</div>
          <div className="stat-value">May 12</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Admission Score</div>
          <div className="stat-value">TBD</div>
        </div>
      </div>

      <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', padding: '40px', borderRadius: '24px', color: 'white', marginTop: '32px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Welcome to CampusTouch</h2>
        <p style={{ opacity: 0.9, maxWidth: '600px' }}>Your application is currently being processed. You can track your status and upload missing documents here.</p>
      </div>
    </DashboardLayout>
  );
};

export default ApplicantDashboard;
