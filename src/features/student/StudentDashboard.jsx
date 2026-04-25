import React, { useState } from 'react';
import { 
  LayoutDashboard, User, BookOpen, 
  Calendar, ClipboardList, LogOut, Bell
} from 'lucide-react';
import DashboardLayout from '../dashboard/DashboardLayout';
import StudentProfile from './StudentProfile';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { logoutUser, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
    { id: 'academics', label: 'Academics', icon: <BookOpen size={20} /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar size={20} /> },
    { id: 'exams', label: 'Exams', icon: <ClipboardList size={20} /> },
  ];

  const studentSidebar = (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">CT</div>
        <span>CampusTouch</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <StudentProfile />;
      default:
        return (
          <div className="empty-state">
            <h2>{menuItems.find(m => m.id === activeTab)?.label} Module</h2>
            <p>This section is currently under development to bring you the best experience.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout 
      title={menuItems.find(m => m.id === activeTab)?.label} 
      roleColor="#4f46e5"
      sidebar={studentSidebar}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default StudentDashboard;
