import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { getStudentAttendance } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';

const StudentAttendance = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setIsLoading(true);
        const studentId = user?.id || user?.nameid || user?.sub;
        const response = await getStudentAttendance(studentId);
        setAttendanceData(response);
      } catch (err) {
        console.error('Failed to fetch attendance:', err);
        setError(err?.message || 'Unable to load attendance records.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAttendance();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#0066cc] mb-4" size={36} />
        <p className="text-[#1d1d1f]/50 text-[14px] font-['SF Pro Text']">Loading your attendance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <AlertCircle className="text-[#ff3b30] mb-4" size={40} />
        <p className="text-[#1d1d1f] font-semibold text-[17px] mb-2">Failed to load attendance</p>
        <p className="text-[#1d1d1f]/50 text-[14px]">{error}</p>
      </div>
    );
  }

  if (!attendanceData || (Array.isArray(attendanceData) && attendanceData.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-[18px] border border-[#e0e0e0] p-10 text-center">
        <CalendarCheck className="text-[#1d1d1f]/20 mb-6" size={56} />
        <h3 className="text-[20px] font-semibold font-['SF Pro Display'] text-[#1d1d1f] mb-2">No Attendance Records</h3>
        <p className="text-[#1d1d1f]/40 text-[14px] max-w-md">Your attendance has not been recorded yet. Check back later.</p>
      </div>
    );
  }

  const isArray = Array.isArray(attendanceData);
  const records = isArray ? attendanceData : (attendanceData.records || attendanceData.items || []);

  let totalClasses = records.length;
  let totalPresent = records.filter(r => r.status?.toLowerCase() === 'present' || r.isPresent).length;
  let attendancePercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  if (!isArray) {
    if (attendanceData.totalClasses !== undefined) totalClasses = attendanceData.totalClasses;
    if (attendanceData.totalPresent !== undefined) totalPresent = attendanceData.totalPresent;
    if (attendanceData.percentage !== undefined) attendancePercentage = attendanceData.percentage;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[18px] p-6 border border-[#e0e0e0] flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[14px] bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center">
            <CalendarCheck size={28} />
          </div>
          <div>
            <h2 className="text-[22px] font-semibold font-['SF Pro Display'] text-[#1d1d1f]">My Attendance</h2>
            <p className="text-[13px] text-[#1d1d1f]/50 mt-0.5">Overview of your academic presence</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-[#f5f5f7] rounded-[12px] p-4 text-center min-w-[100px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40 mb-1">Total Present</p>
            <p className="text-[24px] font-semibold font-['SF Pro Display'] text-[#0066cc]">{totalPresent}</p>
          </div>
          <div className="bg-[#f5f5f7] rounded-[12px] p-4 text-center min-w-[100px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40 mb-1">Percentage</p>
            <p className={`text-[24px] font-semibold font-['SF Pro Display'] ${attendancePercentage < 75 ? 'text-[#ff3b30]' : 'text-[#0066cc]'}`}>
              {attendancePercentage}%
            </p>
          </div>
        </div>
      </motion.div>

      {records.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-[#e0e0e0]">
            <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Recent Attendance Records</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f5f7]/50">
                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40">Date</th>
                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40">Subject/Session</th>
                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40">Status</th>
                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e0e0]">
                {records.map((record, index) => {
                  const isPresent = record.status?.toLowerCase() === 'present' || record.isPresent;
                  return (
                    <tr key={record.id || index} className="hover:bg-[#f5f5f7]/30 transition-colors">
                      <td className="px-6 py-4 text-[14px] font-medium text-[#1d1d1f]">
                        {record.date ? new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#1d1d1f]/60">
                        {record.subject || record.course || record.session || 'General'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold ${
                          isPresent ? 'bg-[#0066cc]/10 text-[#0066cc]' : 'bg-[#f5f5f7] text-[#1d1d1f]/60'
                        }`}>
                          {isPresent ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {isPresent ? 'Present' : 'Absent'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-[#1d1d1f]/50">
                        {record.remarks || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {records.length === 0 && !isArray && (
        <div className="bg-[#f5f5f7] rounded-[12px] p-5 text-[12px] text-[#1d1d1f]/50 overflow-auto">
          <p className="font-semibold mb-2">Unrecognized data format. Raw response:</p>
          <pre>{JSON.stringify(attendanceData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;
