import React, { useState } from 'react';
import { 
  Users, Building2, BookOpen, Book, UserCheck, 
  Layers, Calendar, ClipboardList, LayoutDashboard, LogOut
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import DepartmentManagement from '../admin/DepartmentManagement';
import ProgramManagement from '../admin/ProgramManagement';
import SemesterManagement from '../admin/SemesterManagement';
import SubjectManagement from '../admin/SubjectManagement';
import ClassManagement from '../admin/ClassManagement';
import AssignSubjectManagement from '../admin/AssignSubjectManagement';
import StudentManagement from '../admin/StudentManagement';
import StaffManagement from '../admin/StaffManagement';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getStudents } from '../../services/studentService';
import { getAllStaff } from '../../services/staffService';
import { departmentService } from '../../services/academicServices';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    students: 0,
    staff: 0,
    departments: 0,
    totalUsers: 0,
    health: '98%'
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchStats = async () => {
      if (activeTab !== 'overview') return;
      
      setIsLoadingStats(true);
      try {
        const [studentRes, staffRes, deptRes] = await Promise.all([
          getStudents(1, 1000), // Fetch a larger page to ensure accurate counting for small sets
          getAllStaff(),
          departmentService.getAll()
        ]);

        const studentList = studentRes.data || [];
        const totalStudentCount = studentRes.totalCount || studentList.length;
        const activeStudentCount = studentList.filter(s => s.isActive).length;
        
        const staffList = staffRes.data || staffRes || [];
        const staffCount = Array.isArray(staffList) ? staffList.length : 0;
        
        const deptList = deptRes.data?.data || deptRes.data || [];
        const deptCount = Array.isArray(deptList) ? deptList.length : 0;

        setStats({
          students: totalStudentCount,
          activeStudents: activeStudentCount,
          staff: staffCount,
          departments: deptCount,
          totalUsers: totalStudentCount + staffCount,
          health: '98%'
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, [activeTab]);

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
                <div className="stat-value">{isLoadingStats ? '...' : stats.totalUsers}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Active Staff</div>
                <div className="stat-value">{isLoadingStats ? '...' : stats.staff}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Active Students</div>
                <div className="stat-value">{isLoadingStats ? '...' : stats.activeStudents}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Students</div>
                <div className="stat-value">{isLoadingStats ? '...' : stats.students}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Departments</div>
                <div className="stat-value">{isLoadingStats ? '...' : stats.departments}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">System Health</div>
                <div className="stat-value">{stats.health}</div>
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
        return <StaffManagement />;

      case 'departments':
        return <DepartmentManagement />;

      case 'courses':
        return <ProgramManagement />;

      case 'semesters':
        return <SemesterManagement />;

      case 'subjects':
        return <SubjectManagement />;

      case 'assign':
        return <AssignSubjectManagement />;

      case 'classes':
        return <ClassManagement />;

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
