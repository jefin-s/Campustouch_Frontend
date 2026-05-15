import { useState, useEffect } from 'react';
import {
  Users, Building2, BookOpen, Book, UserCheck,
  Layers, Calendar, ClipboardList, LayoutDashboard,
  TrendingUp, Shield, Activity, GraduationCap,
  ChevronRight, Sparkles, CheckCircle, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from './DashboardLayout';
import Sidebar from './Sidebar';
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
          getStudents(1, 1000),
          getAllStaff(),
          departmentService.getAll()
        ]);

        // Robust extraction for Student stats
        const studentData = studentRes.data?.items || studentRes.data?.data || studentRes.data || (Array.isArray(studentRes) ? studentRes : []);
        const totalStudentCount = studentRes.data?.totalCount || studentRes.data?.total || studentRes.totalCount || studentRes.total || (Array.isArray(studentData) ? studentData.length : 0);
        const activeStudentCount = Array.isArray(studentData) ? studentData.filter(s => s.isActive !== false).length : 0;

        // Robust extraction for Staff stats
        const staffData = staffRes.data?.items || staffRes.data?.data || staffRes.data || (Array.isArray(staffRes) ? staffRes : []);
        const totalStaffCount = staffRes.data?.totalCount || staffRes.data?.total || staffRes.totalCount || staffRes.total || (Array.isArray(staffData) ? staffData.length : 0);
        const activeStaffCount = Array.isArray(staffData) ? staffData.filter(s => s.isActive !== false).length : 0;

        // Robust extraction for Department stats
        const deptData = deptRes.data?.items || deptRes.data?.data || deptRes.data || (Array.isArray(deptRes) ? deptRes : []);
        const deptCount = deptRes.data?.totalCount || deptRes.data?.total || deptRes.totalCount || deptRes.total || (Array.isArray(deptData) ? deptData.length : 0);

        setStats({
          students: totalStudentCount,
          activeStudents: activeStudentCount,
          staff: activeStaffCount,
          departments: deptCount,
          totalUsers: totalStudentCount + totalStaffCount,
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

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, delta: '+12.4%', icon: <Users size={20} /> },
    { label: 'Active Staff', value: stats.staff, delta: '+4.3%', icon: <UserCheck size={20} /> },
    { label: 'Active Students', value: stats.activeStudents, delta: '+8.1%', icon: <GraduationCap size={20} /> },
    { label: 'Departments', value: stats.departments, delta: '+2 New', icon: <Building2 size={20} /> },
  ];

  const enrollmentData = [46, 53, 58, 64, 69, 75, 81];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const maxValue = Math.max(...enrollmentData);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="max-w-[1440px] mx-auto px-6 py-8 space-y-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between flex-wrap gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-[#0066cc]" />
                  <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0066cc]">Analytics Dashboard</span>
                </div>
                <h1 className="text-[32px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] text-[#1d1d1f]">
                  Analytics Center
                </h1>
                <p className="text-[15px] font-['SF Pro Text'] text-[#1d1d1f]/60 mt-1">
                  Real-time institutional performance metrics.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-[#f5f5f7] px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#0066cc] animate-pulse"></div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/60">Live Sync Active</span>
              </div>
            </motion.div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {statCards.map((card, index) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-[14px] p-6 border border-[#e0e0e0] hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 bg-[#0066cc]/10 rounded-xl flex items-center justify-center text-[#0066cc]">
                      {card.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-[#0066cc] bg-[#0066cc]/10 px-2.5 py-1 rounded-full">
                      {card.delta}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40 mb-1">
                    {card.label}
                  </p>
                  <h3 className="text-[28px] font-semibold font-['SF Pro Display'] text-[#1d1d1f]">
                    {isLoadingStats ? '...' : card.value}
                  </h3>
                </motion.div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Enrollment Trend Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 bg-white rounded-[18px] p-6 border border-[#e0e0e0]"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-[20px] font-semibold font-['SF Pro Display'] text-[#1d1d1f]">
                      Enrollment Trend
                    </h3>
                    <p className="text-[13px] font-['SF Pro Text'] text-[#1d1d1f]/50 mt-0.5">
                      Student growth year-to-date
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#0066cc] text-[12px] font-semibold bg-[#0066cc]/10 px-3 py-1.5 rounded-full">
                    <TrendingUp size={14} />
                    +18.2%
                  </div>
                </div>

                <div className="relative h-[280px] w-full">
                  <svg className="w-full h-full" viewBox="0 0 600 280" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0066cc" />
                        <stop offset="100%" stopColor="#0071e3" />
                      </linearGradient>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(0,102,204,0.08)" />
                        <stop offset="100%" stopColor="rgba(0,102,204,0)" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((percent) => {
                      const y = 280 - 40 - (percent / 100) * 200;
                      return (
                        <line
                          key={percent}
                          x1="40"
                          y1={y}
                          x2="560"
                          y2={y}
                          stroke="#e0e0e0"
                          strokeWidth="1"
                          strokeDasharray="4"
                        />
                      );
                    })}

                    {/* Area under line */}
                    <path
                      d={`M 40 ${280 - 40} L ${enrollmentData.map((value, i) => {
                        const x = 40 + (i * (520 / (enrollmentData.length - 1)));
                        const y = 280 - 40 - (value / maxValue) * 200;
                        return `${x},${y}`;
                      }).join(' L ')} L 560 ${280 - 40} Z`}
                      fill="url(#areaGradient)"
                    />

                    {/* Main line */}
                    <motion.polyline
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={enrollmentData.map((value, i) => {
                        const x = 40 + (i * (520 / (enrollmentData.length - 1)));
                        const y = 280 - 40 - (value / maxValue) * 200;
                        return `${x},${y}`;
                      }).join(' ')}
                    />

                    {/* Data points */}
                    {enrollmentData.map((value, i) => {
                      const x = 40 + (i * (520 / (enrollmentData.length - 1)));
                      const y = 280 - 40 - (value / maxValue) * 200;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#0066cc"
                          stroke="white"
                          strokeWidth="2"
                        />
                      );
                    })}
                  </svg>

                  {/* X-axis labels */}
                  <div className="flex justify-between mt-2 px-6">
                    {months.map((month) => (
                      <span key={month} className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1d1d1f]/30">
                        {month}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Population Split */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-[18px] p-6 border border-[#e0e0e0]"
              >
                <h3 className="text-[20px] font-semibold font-['SF Pro Display'] text-[#1d1d1f] mb-1">
                  Population Split
                </h3>
                <p className="text-[13px] font-['SF Pro Text'] text-[#1d1d1f]/50 mb-6">
                  Users by core roles
                </p>

                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48 mb-8">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#f5f5f7" strokeWidth="8" />
                      <motion.circle
                        cx="50" cy="50" r="42" fill="none" stroke="#0066cc" strokeWidth="8"
                        strokeDasharray="263.89"
                        initial={{ strokeDashoffset: 263.89 }}
                        animate={{
                          strokeDashoffset: 263.89 - (263.89 * (stats.students / Math.max(stats.totalUsers, 1)) * 100) / 100
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[28px] font-semibold font-['SF Pro Display'] text-[#1d1d1f]">
                        {isLoadingStats ? '...' : stats.totalUsers}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40 mt-1">
                        Total Users
                      </span>
                    </div>
                  </div>

                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#f5f5f7] rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0066cc]"></div>
                        <span className="text-[13px] font-['SF Pro Text'] text-[#1d1d1f]/70">Students</span>
                      </div>
                      <span className="text-[14px] font-semibold text-[#1d1d1f]">
                        {Math.round((stats.students / Math.max(stats.totalUsers, 1)) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#f5f5f7] rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a2c]"></div>
                        <span className="text-[13px] font-['SF Pro Text'] text-[#1d1d1f]/70">Faculty</span>
                      </div>
                      <span className="text-[14px] font-semibold text-[#1d1d1f]">
                        {Math.round((stats.staff / Math.max(stats.totalUsers, 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Module Performance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2 bg-white rounded-[18px] p-6 border border-[#e0e0e0]"
              >
                <h3 className="text-[20px] font-semibold font-['SF Pro Display'] text-[#1d1d1f] mb-1">
                  Module Performance
                </h3>
                <p className="text-[13px] font-['SF Pro Text'] text-[#1d1d1f]/50 mb-6">
                  Load & efficiency across core services
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { label: 'Admissions', value: 86 },
                    { label: 'Academic Ops', value: 78 },
                    { label: 'Exam & Results', value: 91 },
                    { label: 'Attendance', value: 74 },
                  ].map((item, index) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] font-['SF Pro Text'] text-[#1d1d1f]/70">{item.label}</span>
                        <span className="text-[14px] font-semibold text-[#1d1d1f]">{item.value}%</span>
                      </div>
                      <div className="h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                          className="h-full rounded-full bg-[#0066cc]"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* System Health */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#272729] rounded-[18px] p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066cc]/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <h3 className="text-[20px] font-semibold font-['SF Pro Display'] text-white mb-1">
                    System Infrastructure
                  </h3>
                  <p className="text-[13px] font-['SF Pro Text'] text-white/50 mb-6">
                    Live health and connectivity status
                  </p>

                  <div className="flex items-center gap-5">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                        <motion.circle
                          cx="50" cy="50" r="42" fill="none" stroke="#0066cc" strokeWidth="6"
                          strokeDasharray="263.89"
                          initial={{ strokeDashoffset: 263.89 }}
                          animate={{ strokeDashoffset: 263.89 * 0.02 }}
                          transition={{ duration: 1.5 }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[22px] font-semibold font-['SF Pro Display'] text-white">
                          {stats.health}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-[13px] font-['SF Pro Text'] text-white/60 leading-relaxed">
                        All clusters operational. No critical latency detected.
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0066cc]">
                        <Activity size={12} />
                        API: 210ms
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'students': return <StudentManagement />;
      case 'approvals': return <ApplicantApproval />;
      case 'staff': return <StaffManagement />;
      case 'departments': return <DepartmentManagement />;
      case 'courses': return <ProgramManagement />;
      case 'semesters': return <SemesterManagement />;
      case 'subjects': return <SubjectManagement />;
      case 'assign': return <AssignSubjectManagement />;
      case 'classes': return <ClassManagement />;
      default: return (
        <div className="max-w-[1440px] mx-auto px-6 py-20">
          <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-12 text-center">
            <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard size={32} className="text-[#1d1d1f]/30" />
            </div>
            <h2 className="text-[20px] font-semibold font-['SF Pro Display'] text-[#1d1d1f]/40 uppercase tracking-wider">
              {menuItems.find(m => m.id === activeTab)?.label} Module
            </h2>
            <p className="text-[14px] font-['SF Pro Text'] text-[#1d1d1f]/30 mt-2">
              Currently being optimized for your experience.
            </p>
          </div>
        </div>
      );
    }
  };

  const adminSidebar = (
    <Sidebar
      menuItems={menuItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );

  return (
    <DashboardLayout
      title={menuItems.find(m => m.id === activeTab)?.label}
      roleColor="#0066cc"
      sidebar={adminSidebar}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboard;