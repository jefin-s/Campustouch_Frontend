import { LayoutDashboard, FileText, Upload, HelpCircle, TrendingUp, CheckCircle2, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from './DashboardLayout';
import Sidebar from './Sidebar';

const ApplicantDashboard = () => {
  const menuItems = [
    { id: 'status', label: 'Status', icon: <LayoutDashboard size={20} /> },
    { id: 'application', label: 'Application', icon: <FileText size={20} /> },
    { id: 'documents', label: 'Documents', icon: <Upload size={20} /> },
    { id: 'support', label: 'Support', icon: <HelpCircle size={20} /> },
  ];

  const applicantSidebar = (
    <Sidebar
      menuItems={menuItems}
      activeTab="status"
      onTabChange={() => {}}
    />
  );

  return (
    <DashboardLayout title="Applicant Dashboard" roleColor="#6366F1" sidebar={applicantSidebar}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Application Status', value: 'Under Review', icon: <FileText size={18} /> },
            { label: 'Documents Verified', value: '4/5', icon: <CheckCircle2 size={18} /> },
            { label: 'Interview Date', value: 'May 12', icon: <Calendar size={18} /> },
            { label: 'Admission Score', value: 'TBD', icon: <TrendingUp size={18} /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              className="bg-white border border-[#e0e0e0] rounded-[14px] p-6 hover:shadow-md transition-all"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40 mb-2">{stat.label}</p>
              <h3 className="text-[22px] font-semibold font-['SF Pro Display'] text-[#1d1d1f] tracking-tight">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#272729] rounded-[18px] p-8 lg:p-12 text-white relative overflow-hidden shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px]"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#0066cc]/10 rounded-full blur-[80px]"></div>
          <div className="relative z-10">
            <h2 className="text-[28px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] mb-3">Welcome to CampusTouch</h2>
            <p className="text-[15px] font-['SF Pro Text'] text-white/70 max-w-xl leading-relaxed mb-8">
              Your application is currently being processed by our admissions committee. We'll notify you as soon as there's an update.
            </p>
            <div className="flex gap-3">
              <button className="bg-[#0066cc] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold flex items-center gap-2 transition-all shadow-[rgba(0,102,204,0.3)_0_4px_12px]">
                Track Progress <ArrowRight size={16} />
              </button>
              <button className="bg-white/10 text-white/80 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all hover:bg-white/20">
                View Requirements
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ApplicantDashboard;
