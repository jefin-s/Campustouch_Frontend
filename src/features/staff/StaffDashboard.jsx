import React, { useState } from 'react';
import { 
  LayoutDashboard, UserCheck, BookOpen, 
  Calendar, ClipboardList, LogOut, Bell, ClipboardCheck
} from 'lucide-react';
import DashboardLayout from '../dashboard/DashboardLayout';
import AttendanceMarking from './AttendanceMarking';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const { logoutUser, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'attendance', label: 'Mark Attendance', icon: <ClipboardCheck size={20} /> },
    { id: 'subjects', label: 'My Subjects', icon: <BookOpen size={20} /> },
    { id: 'schedule', label: 'Time Table', icon: <Calendar size={20} /> },
  ];

  const staffSidebar = (
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
      case 'attendance':
        return <AttendanceMarking />;
      default:
        return (
          <div className="empty-state">
            <h2>{menuItems.find(m => m.id === activeTab)?.label} Module</h2>
            <p>This section is currently under development to support your teaching workflow.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout 
      title={menuItems.find(m => m.id === activeTab)?.label} 
      roleColor="#059669"
      sidebar={staffSidebar}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default StaffDashboard;
