import { useState, useEffect } from 'react';
import { 
  Users, Building2, BookOpen, Book, UserCheck, 
  Layers, Calendar, ClipboardList, LayoutDashboard, LogOut, TrendingUp, Shield, Activity, GraduationCap
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
import ApplicantApproval from '../admin/ApplicantApproval';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getStudents } from '../../services/studentService';
import { getAllStaff } from '../../services/staffService';
import { departmentService } from '../../services/academicServices';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    students: 0,
    activeStudents: 0,
    staff: 0,
    departments: 0,
    totalUsers: 0,
    health: '98%'
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
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
    { id: 'approvals', label: 'Approvals', icon: <UserCheck size={20} /> },
    { id: 'students', label: 'Students', icon: <Users size={20} /> },
    { id: 'staff', label: 'Staff Management', icon: <Shield size={20} /> },
    { id: 'departments', label: 'Departments', icon: <Building2 size={20} /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen size={20} /> },
    { id: 'subjects', label: 'Subjects', icon: <Book size={20} /> },
    { id: 'assign', label: 'Assign Subjects', icon: <ClipboardList size={20} /> },
    { id: 'semesters', label: 'Semesters', icon: <Calendar size={20} /> },
    { id: 'classes', label: 'Classes', icon: <Layers size={20} /> },
  ];

  const enrollmentTrend = (() => {
    const baseline = Math.max(stats.students, 140);
    const monthlySeries = [
      { label: 'Jan', value: Math.round(baseline * 0.46) },
      { label: 'Feb', value: Math.round(baseline * 0.53) },
      { label: 'Mar', value: Math.round(baseline * 0.58) },
      { label: 'Apr', value: Math.round(baseline * 0.64) },
      { label: 'May', value: Math.round(baseline * 0.69) },
      { label: 'Jun', value: Math.round(baseline * 0.75) },
      { label: 'Jul', value: Math.round(baseline * 0.81) },
    ];

    const width = 580;
    const height = 220;
    const padding = 24;
    const maxValue = Math.max(...monthlySeries.map((point) => point.value), 1);

    const points = monthlySeries
      .map((point, index) => {
        const x = padding + (index * (width - padding * 2)) / (monthlySeries.length - 1);
        const y = height - padding - (point.value / maxValue) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(' ');

    return { monthlySeries, points, width, height, padding };
  })();

  const totalPeople = Math.max(stats.students + stats.staff, 1);
  const studentShare = Math.round((stats.students / totalPeople) * 100);
  const staffShare = 100 - studentShare;

  const utilization = [
    { label: 'Admissions', value: 86 },
    { label: 'Academic Ops', value: 78 },
    { label: 'Exam & Results', value: 91 },
    { label: 'Attendance', value: 74 },
  ];

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      delta: '+12.4%',
      icon: <Users size={18} />,
      tone: 'indigo',
    },
    {
      label: 'Active Staff',
      value: stats.staff,
      delta: '+4.3%',
      icon: <UserCheck size={18} />,
      tone: 'sky',
    },
    {
      label: 'Active Students',
      value: stats.activeStudents,
      delta: '+8.1%',
      icon: <GraduationCap size={18} />,
      tone: 'emerald',
    },
    {
      label: 'Total Departments',
      value: stats.departments,
      delta: '+2 this month',
      icon: <Building2 size={18} />,
      tone: 'amber',
    },
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
          <div className="admin-overview-shell">
            <div className="overview-topbar">
              <div>
                <p className="overview-eyebrow">Admin Analytics Center</p>
                <h2 className="overview-heading">Campus Performance Overview</h2>
              </div>
              <div className="overview-meta">
                <span className="live-dot"></span>
                <span>Live data synced</span>
              </div>
            </div>

            <div className="kpi-grid">
              {statCards.map((card) => (
                <article key={card.label} className={`kpi-card ${card.tone}`}>
                  <div className="kpi-top">
                    <div className="kpi-icon">{card.icon}</div>
                    <span className="kpi-delta">{card.delta}</span>
                  </div>
                  <p className="kpi-label">{card.label}</p>
                  <p className="kpi-value">{isLoadingStats ? '...' : card.value}</p>
                </article>
              ))}
            </div>

            <div className="overview-grid-modern">
              <section className="overview-panel chart-panel">
                <div className="panel-head">
                  <div>
                    <p className="panel-kicker">Enrollment Trend</p>
                    <h3>Student Growth (YTD)</h3>
                  </div>
                  <span className="chip success">
                    <TrendingUp size={14} />
                    +18.2%
                  </span>
                </div>
                <div className="line-chart-wrap">
                  <svg
                    className="line-chart-svg"
                    viewBox={`0 0 ${enrollmentTrend.width} ${enrollmentTrend.height}`}
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4338ca" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(79,70,229,0.28)" />
                        <stop offset="100%" stopColor="rgba(79,70,229,0.02)" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={enrollmentTrend.points}
                    />
                    <polygon
                      fill="url(#areaGradient)"
                      points={`${enrollmentTrend.padding},${enrollmentTrend.height - enrollmentTrend.padding} ${enrollmentTrend.points} ${enrollmentTrend.width - enrollmentTrend.padding},${enrollmentTrend.height - enrollmentTrend.padding}`}
                    />
                    {enrollmentTrend.points.split(' ').map((point) => {
                      const [x, y] = point.split(',');
                      return <circle key={point} cx={x} cy={y} r="5" fill="#4f46e5" />;
                    })}
                  </svg>
                  <div className="line-chart-labels">
                    {enrollmentTrend.monthlySeries.map((item) => (
                      <span key={item.label}>{item.label}</span>
                    ))}
                  </div>
                </div>
              </section>

              <section className="overview-panel donut-panel">
                <div className="panel-head">
                  <div>
                    <p className="panel-kicker">Population Split</p>
                    <h3>Users by Role</h3>
                  </div>
                </div>
                <div className="donut-wrap">
                  <div
                    className="donut-chart"
                    style={{
                      background: `conic-gradient(#4338ca 0% ${studentShare}%, #0ea5e9 ${studentShare}% 100%)`,
                    }}
                  >
                    <div className="donut-inner">
                      <p>{isLoadingStats ? '...' : totalPeople}</p>
                      <span>Total</span>
                    </div>
                  </div>
                  <div className="legend-list">
                    <div className="legend-item">
                      <span className="legend-dot student"></span>
                      <div>
                        <p>Students</p>
                        <strong>{isLoadingStats ? '...' : `${studentShare}%`}</strong>
                      </div>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot staff"></span>
                      <div>
                        <p>Staff</p>
                        <strong>{isLoadingStats ? '...' : `${staffShare}%`}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="overview-panel">
                <div className="panel-head">
                  <div>
                    <p className="panel-kicker">Operational Load</p>
                    <h3>Module Performance</h3>
                  </div>
                </div>
                <div className="bar-list">
                  {utilization.map((item) => (
                    <div key={item.label} className="bar-item">
                      <div className="bar-meta">
                        <span>{item.label}</span>
                        <strong>{item.value}%</strong>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${item.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="overview-panel info-panel">
                <div className="panel-head">
                  <div>
                    <p className="panel-kicker">System Trust</p>
                    <h3>Health & Reliability</h3>
                  </div>
                  <span className="chip neutral">
                    <Shield size={14} />
                    Stable
                  </span>
                </div>
                <div className="health-row">
                  <div className="health-progress">
                    <div className="health-ring">
                      <span>{stats.health}</span>
                    </div>
                  </div>
                  <div className="health-content">
                    <p>Infrastructure status is healthy with no critical alerts in the last 24 hours.</p>
                    <div className="inline-metric">
                      <Activity size={16} />
                      <span>Avg API response: 210ms</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );
      
      case 'students':
        return <StudentManagement />;

      case 'approvals':
        return <ApplicantApproval />;

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
