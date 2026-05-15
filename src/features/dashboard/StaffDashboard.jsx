import { useState } from 'react';
import { LayoutDashboard, Users, Book, FileCheck, Calendar, Bell, ArrowRight } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'students', label: 'My Students', icon: <Users size={20} /> },
    { id: 'classes', label: 'Classes', icon: <Book size={20} /> },
    { id: 'grading', label: 'Grading', icon: <FileCheck size={20} /> },
  ];

  return (
    <DashboardLayout
      title="Faculty Dashboard"
      sidebar={<Sidebar menuItems={menuItems} activeTab={activeTab} onTabChange={setActiveTab} />}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
        {/* Faculty Header Card */}
        <div className="bg-[#272729] rounded-[18px] p-8 lg:p-12 text-white relative overflow-hidden shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px]">
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 rounded-full bg-[#0066cc] animate-pulse"></span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0066cc]">Portal Active</span>
              </div>
              <h2 className="text-[32px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] mb-3">Academic Excellence Starts with You.</h2>
              <p className="text-[15px] font-['SF Pro Text'] text-white/70 mb-6">Manage your teaching schedule, evaluate student performance, and coordinate academic activities across departments.</p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-[#0066cc] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold flex items-center gap-2 transition-all shadow-[rgba(0,102,204,0.3)_0_4px_12px]">My Schedule <ArrowRight size={16} /></button>
                <button className="bg-white/10 text-white/80 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all hover:bg-white/20">Faculty Resources</button>
              </div>
            </motion.div>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066cc]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-8 right-8 opacity-[0.03]">
            <Book size={180} />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Assigned Classes', value: '06', icon: <Book className="text-[#0066cc]" /> },
            { label: 'Total Students', value: '180', icon: <Users className="text-[#0066cc]" /> },
            { label: 'Pending Grades', value: '12', icon: <FileCheck className="text-[#0066cc]" /> },
            { label: 'Notifications', value: '04', icon: <Bell className="text-[#0066cc]" /> },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-[#e0e0e0] rounded-[14px] p-6 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-[10px] bg-[#0066cc]/10 flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40 mb-1">{stat.label}</p>
              <h3 className="text-[24px] font-semibold font-['SF Pro Display'] text-[#1d1d1f]">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[#e0e0e0] rounded-[18px] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[20px] font-semibold font-['SF Pro Display'] text-[#1d1d1f]">Today's Schedule</h3>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#f5f5f7] text-[#1d1d1f]/50">3 Classes Left</span>
            </div>
            <div className="space-y-3">
              {[
                { time: '09:00 AM', subject: 'Digital Signal Processing', room: 'Hall A-102', status: 'Completed' },
                { time: '11:30 AM', subject: 'Embedded Systems Lab', room: 'Lab 4', status: 'Ongoing' },
                { time: '02:00 PM', subject: 'VLSI Design', room: 'Room 304', status: 'Upcoming' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-5 p-4 rounded-[12px] bg-[#f5f5f7] hover:bg-white hover:border hover:border-[#e0e0e0] transition-all">
                  <div className="text-center min-w-[90px]">
                    <p className="text-[14px] font-semibold text-[#1d1d1f]">{item.time}</p>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/30 mt-0.5">Start</p>
                  </div>
                  <div className="h-10 w-px bg-[#e0e0e0]"></div>
                  <div className="flex-1">
                    <h4 className="text-[14px] font-semibold text-[#1d1d1f]">{item.subject}</h4>
                    <p className="text-[11px] text-[#1d1d1f]/40">{item.room}</p>
                  </div>
                  <span className={`text-[9px] font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                    item.status === 'Completed' ? 'bg-[#f5f5f7] text-[#1d1d1f]/40' :
                    item.status === 'Ongoing' ? 'bg-[#0066cc]/10 text-[#0066cc]' : 'bg-[#f5f5f7] text-[#1d1d1f]/60'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#272729] rounded-[18px] p-6 text-white">
            <h3 className="text-[20px] font-semibold font-['SF Pro Display'] text-white mb-5">Faculty Updates</h3>
            <div className="space-y-5">
              {[
                { title: 'New Research Grant', date: 'Oct 12', desc: 'Applications open for the 2024 Science Grant.' },
                { title: 'Faculty Meeting', date: 'Oct 15', desc: 'General assembly in the main auditorium.' },
              ].map((news, idx) => (
                <div key={idx} className="space-y-1.5 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[14px] font-semibold text-white/90">{news.title}</h4>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">{news.date}</span>
                  </div>
                  <p className="text-[12px] text-white/50 leading-relaxed">{news.desc}</p>
                </div>
              ))}
              <button className="w-full mt-4 py-3 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-white hover:text-[#1d1d1f] transition-all">
                View Notice Board
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
