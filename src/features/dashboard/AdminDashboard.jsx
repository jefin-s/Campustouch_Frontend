import React, { useState } from 'react';
import { 
  Users, Building2, BookOpen, Book, UserCheck, 
  Layers, Calendar, ClipboardList, LayoutDashboard, LogOut
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import ManagementTable from '../admin/ManagementTable';
import StudentManagement from '../admin/StudentManagement';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'students', label: 'Students', icon: <Users size={20} /> },
    { id: 'staff', label: 'Staff Management', icon: <UserCheck size={20} /> },
    { id: 'departments', label: 'Departments', icon: <Building2 size={20} /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen size={20} /> },
    { id: 'subjects', label: 'Subjects', icon: <Book size={20} /> },
    { id: 'assign', label: 'Assign Subjects', icon: <ClipboardList size={20} /> },
    { id: 'semesters', label: 'Semesters', icon: <Calendar size={20} /> },
    { id: 'classes', label: 'Classes', icon: <Layers size={20} /> },
  ];

  const adminSidebar = (
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
      case 'overview':
        return (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Users</div>
                <div className="stat-value">1,284</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Active Staff</div>
                <div className="stat-value">42</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Students</div>
                <div className="stat-value">1,120</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">System Health</div>
                <div className="stat-value">98%</div>
              </div>
            </div>
            
            <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '40px', borderRadius: '24px', color: 'white', marginTop: '32px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>System Overview</h2>
              <p style={{ opacity: 0.9, maxWidth: '600px' }}>Manage all campus operations, user roles, and system configurations from this central hub.</p>
            </div>
          </>
        );
      
      case 'students':
        return <StudentManagement />;

      case 'staff':
        return (
          <ManagementTable 
            title="Staff Management" 
            columns={[
              { header: 'Name', accessor: 'name' },
              { header: 'Designation', accessor: 'designation' },
              { header: 'Department', accessor: 'dept' },
              { header: 'Joined', accessor: 'joined' }
            ]}
            data={[
              { name: 'Dr. Robert Wilson', designation: 'Professor', dept: 'CSE', joined: '2020-05-15' },
              { name: 'Sarah Miller', designation: 'Lecturer', dept: 'ECE', joined: '2021-08-20' }
            ]}
          />
        );

      case 'departments':
        return (
          <ManagementTable 
            title="Departments" 
            columns={[
              { header: 'Dept Name', accessor: 'name' },
              { header: 'Head of Dept', accessor: 'hod' },
              { header: 'Total Staff', accessor: 'staffCount' }
            ]}
            data={[
              { name: 'Computer Science', hod: 'Dr. Wilson', staffCount: 15 },
              { name: 'Electronics', hod: 'Dr. Sarah', staffCount: 12 }
            ]}
          />
        );

      case 'courses':
        return (
          <ManagementTable 
            title="Course Management" 
            columns={[
              { header: 'Course Name', accessor: 'name' },
              { header: 'Code', accessor: 'code' },
              { header: 'Duration', accessor: 'duration' },
              { header: 'Department', accessor: 'dept' }
            ]}
            data={[
              { name: 'B.Tech CS', code: 'CS101', duration: '4 Years', dept: 'Computer Science' },
              { name: 'M.Tech AI', code: 'AI202', duration: '2 Years', dept: 'Computer Science' }
            ]}
          />
        );

      default:
        return (
          <div className="empty-state">
            <h2>{menuItems.find(m => m.id === activeTab)?.label} Module</h2>
            <p>The {menuItems.find(m => m.id === activeTab)?.label} management module is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout 
      title={menuItems.find(m => m.id === activeTab)?.label} 
      roleColor="#ef4444"
      sidebar={adminSidebar}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
