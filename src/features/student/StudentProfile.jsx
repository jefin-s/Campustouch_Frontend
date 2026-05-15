import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Book,
  Building,
  GraduationCap,
  Shield,
  Loader2,
  Clock,
  CreditCard,
  Trophy,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { getStudentProfile } from '../../services/studentService';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getStudentProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#0066cc] mx-auto mb-4" size={36} />
          <p className="text-[#1d1d1f]/50 text-[14px]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-[#fef2f2] border border-[#fecaca] rounded-[14px] p-8 text-center">
        <p className="text-[#991b1b]">Unable to load profile data. Please try again later.</p>
      </div>
    );
  }

  const profileImage = profile.profileImageUrl || profile.profileImage;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-[28px] font-semibold font-['SF Pro Display'] text-[#1d1d1f]">Student Profile</h1>
        <p className="text-[14px] text-[#1d1d1f]/50 mt-1">View your academic and personal information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden mb-6"
      >
        <div className="bg-[#272729] px-8 py-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-4 border-white/20 overflow-hidden bg-white">
                {profileImage ? (
                  <img
                    src={profileImage.startsWith('http') ? profileImage : `https://localhost:7284/${profileImage}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#0066cc]/10">
                    <span className="text-[36px] font-semibold text-[#0066cc]">
                      {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-[26px] font-semibold font-['SF Pro Display'] text-white mb-1">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-white/60 text-[15px] mb-3">
                {profile.courseName || 'Computer Science Engineering'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-white/10 rounded-full text-[12px] text-white/80">
                  ID: {profile.admissionNumber}
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-[12px] text-white/80">
                  Semester {profile.currentSemester || '4'}
                </span>
              </div>
            </div>

            <span className="px-4 py-1.5 bg-[#0066cc] rounded-full text-[12px] font-semibold text-white">
              Active Student
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e0e0e0]">
          <StatItem label="Attendance" value="96%" />
          <StatItem label="CGPA" value="8.9" />
          <StatItem label="Credits Earned" value="142" />
          <StatItem label="Rank" value="#12" />
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[18px] border border-[#e0e0e0] p-6"
        >
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#e0e0e0]">
            <User size={18} className="text-[#0066cc]" />
            <h3 className="text-[18px] font-semibold text-[#1d1d1f]">Personal Information</h3>
          </div>
          <div className="space-y-3">
            <InfoRow icon={Mail} label="Email" value={profile.email} />
            <InfoRow icon={Phone} label="Phone" value={profile.phoneNumber} />
            <InfoRow icon={Calendar} label="Date of Birth" value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not specified'} />
            <InfoRow icon={MapPin} label="Address" value={profile.address || 'Not specified'} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[18px] border border-[#e0e0e0] p-6"
        >
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#e0e0e0]">
            <GraduationCap size={18} className="text-[#0066cc]" />
            <h3 className="text-[18px] font-semibold text-[#1d1d1f]">Academic Information</h3>
          </div>
          <div className="space-y-3">
            <InfoRow icon={Building} label="Department" value={profile.departmentName || 'Information Technology'} />
            <InfoRow icon={Book} label="Course" value={profile.courseName || 'Bachelor of Technology'} />
            <InfoRow icon={Calendar} label="Admission Date" value={profile.admissionDate ? new Date(profile.admissionDate).toLocaleDateString() : 'Not specified'} />
            <InfoRow icon={Shield} label="Guardian" value={profile.guardianName || 'Not specified'} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-[18px] border border-[#e0e0e0] p-6"
        >
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#e0e0e0]">
            <Clock size={18} className="text-[#0066cc]" />
            <h3 className="text-[18px] font-semibold text-[#1d1d1f]">Recent Activity</h3>
          </div>
          <div className="space-y-2">
            <ActivityItem title="Assignment Submitted" description="Data Structures - Algorithm Analysis" time="2 hours ago" status="completed" />
            <ActivityItem title="Attendance Marked" description="Physics Laboratory" time="Yesterday" status="completed" />
            <ActivityItem title="Fee Payment Reminder" description="Semester Fee Due Date: March 15, 2026" time="3 days ago" status="pending" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickLink icon={Book} label="View Courses" />
            <QuickLink icon={Calendar} label="Time Table" />
            <QuickLink icon={CreditCard} label="Pay Fees" />
            <QuickLink icon={Trophy} label="Achievements" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => (
  <div className="bg-white px-6 py-4 text-center">
    <p className="text-[22px] font-semibold font-['SF Pro Display'] text-[#1d1d1f]">{value}</p>
    <p className="text-[11px] text-[#1d1d1f]/40 mt-0.5">{label}</p>
  </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-[10px] hover:bg-[#f5f5f7] transition-colors">
    <Icon size={16} className="text-[#1d1d1f]/30 mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40">{label}</p>
      <p className="text-[14px] text-[#1d1d1f] mt-0.5">{value || 'Not provided'}</p>
    </div>
  </div>
);

const ActivityItem = ({ title, description, time, status }) => (
  <div className="flex items-start gap-3 p-4 rounded-[12px] border border-[#e0e0e0] hover:bg-[#f5f5f7] transition-colors">
    <div className={`p-2 rounded-[8px] flex-shrink-0 ${status === 'completed' ? 'bg-[#0066cc]/10' : 'bg-[#f5f5f7]'}`}>
      {status === 'completed' ? (
        <CheckCircle size={14} className="text-[#0066cc]" />
      ) : (
        <Clock size={14} className="text-[#1d1d1f]/40" />
      )}
    </div>
    <div className="flex-1">
      <h4 className="text-[14px] font-semibold text-[#1d1d1f]">{title}</h4>
      <p className="text-[12px] text-[#1d1d1f]/50 mt-0.5">{description}</p>
      <p className="text-[10px] text-[#1d1d1f]/30 mt-1">{time}</p>
    </div>
    <ExternalLink size={14} className="text-[#1d1d1f]/20 flex-shrink-0" />
  </div>
);

const QuickLink = ({ icon: Icon, label }) => {
  return (
    <button className="p-4 rounded-[12px] bg-[#f5f5f7] hover:bg-[#0066cc]/10 hover:text-[#0066cc] transition-all text-center group">
      <Icon size={22} className="mx-auto mb-2 text-[#1d1d1f]/40 group-hover:text-[#0066cc] transition-colors" />
      <p className="text-[12px] font-semibold text-[#1d1d1f]/60 group-hover:text-[#0066cc] transition-colors">{label}</p>
    </button>
  );
};

export default StudentProfile;
