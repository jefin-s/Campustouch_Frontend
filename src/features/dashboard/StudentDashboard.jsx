import { useState } from 'react';
import { LayoutDashboard, User, BookOpen, GraduationCap, Calendar, Clock, ArrowRight } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'courses', label: 'My Courses', icon: <BookOpen size={20} /> },
    { id: 'grades', label: 'Grades', icon: <GraduationCap size={20} /> },
  ];

  return (
    <DashboardLayout
      title="Student Overview"
      sidebar={<Sidebar menuItems={menuItems} activeTab={activeTab} onTabChange={setActiveTab} />}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
        {/* Welcome Section */}
        <div className="bg-[#272729] rounded-[18px] p-8 lg:p-12 text-white relative overflow-hidden shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px]">
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] inline-block px-3 py-1.5 rounded-full bg-white/10 text-white/60 mb-5">
                Academic Session 2024-25
              </span>
              <h2 className="text-[32px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] mb-3">Welcome back, Scholar!</h2>
              <p className="text-[15px] font-['SF Pro Text'] text-white/70 mb-6">You have <strong className="text-white">3 classes</strong> scheduled for today. Keep up the great work.</p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-[#0066cc] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold flex items-center gap-2 transition-all shadow-[rgba(0,102,204,0.3)_0_4px_12px]">View Schedule <ArrowRight size={16} /></button>
              </div>
            </motion.div>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066cc]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 opacity-[0.03]">
            <GraduationCap size={200} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Current GPA', value: '3.8', sub: '+0.2 from last sem', icon: <GraduationCap className="text-[#0066cc]" /> },
            { label: 'Attendance', value: '92%', sub: 'Good standing', icon: <Calendar className="text-[#0066cc]" /> },
            { label: 'Credits', value: '64', sub: 'of 120 required', icon: <BookOpen className="text-[#0066cc]" /> },
            { label: 'Tasks', value: '05', sub: 'Due this week', icon: <Clock className="text-[#0066cc]" /> },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-[#e0e0e0] rounded-[14px] p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="w-11 h-11 rounded-[10px] bg-[#0066cc]/10 flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40 mb-1">{stat.label}</p>
              <h3 className="text-[24px] font-semibold font-['SF Pro Display'] text-[#1d1d1f] mb-1">{stat.value}</h3>
              <p className="text-[11px] font-['SF Pro Text'] text-[#1d1d1f]/40">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[#e0e0e0] rounded-[18px] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[20px] font-semibold font-['SF Pro Display'] text-[#1d1d1f]">Ongoing Courses</h3>
              <button className="text-[#0066cc] text-[12px] font-semibold hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Advanced Computer Architecture', code: 'CS401', instructor: 'Dr. Sarah Wilson', progress: 75 },
                { title: 'Machine Learning Fundamentals', code: 'CS405', instructor: 'Prof. David Miller', progress: 40 },
                { title: 'Cloud Computing Ethics', code: 'CS412', instructor: 'Dr. Robert Chen', progress: 90 },
              ].map((course, idx) => (
                <div key={idx} className="p-5 rounded-[14px] bg-[#f5f5f7] hover:bg-white hover:border hover:border-[#e0e0e0] transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#1d1d1f]">{course.title}</h4>
                      <p className="text-[11px] text-[#1d1d1f]/40">{course.code} &bull; {course.instructor}</p>
                    </div>
                    <span className="text-[14px] font-semibold text-[#0066cc]">{course.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-[#e0e0e0] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-[#0066cc] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#e0e0e0] rounded-[18px] p-6">
            <h3 className="text-[20px] font-semibold font-['SF Pro Display'] text-[#1d1d1f] mb-5">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Register for Courses', desc: 'Enroll in upcoming semester' },
                { label: 'Download Transcript', desc: 'Get your academic records' },
                { label: 'Pay Semester Fees', desc: 'View and pay pending dues' },
                { label: 'Student Support', desc: 'Get help and guidance' },
              ].map((action, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-4 rounded-[12px] bg-[#f5f5f7] hover:bg-[#0066cc]/5 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-semibold text-[#1d1d1f]">{action.label}</p>
                      <p className="text-[11px] text-[#1d1d1f]/40 mt-0.5">{action.desc}</p>
                    </div>
                    <ArrowRight size={16} className="text-[#0066cc] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
