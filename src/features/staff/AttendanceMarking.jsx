import { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle,
  Save, Loader2, ClipboardCheck, Clock, Send, Calendar, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { markAttendance } from '../../services/attendanceService';
import { classService, subjectService } from '../../services/academicServices';
import { getStudents } from '../../services/studentService';
import { getApiMessage } from '../../utils/apiMessage';

const AttendanceMarking = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  const [students, setStudents] = useState([]);
  const [markedStatuses, setMarkedStatuses] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  const [rowSubmitting, setRowSubmitting] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [classRes, subRes] = await Promise.all([
          classService.getAll(),
          subjectService.getAll()
        ]);
        const classesData = classRes.data.data || classRes.data || [];
        const subjectsData = subRes.data.data || subRes.data || [];
        setClasses(Array.isArray(classesData) ? classesData : []);
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      } catch (error) {
        console.error('Metadata fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  const handleFetchStudents = async (page = 1) => {
    if (!selectedClass) return;
    setIsStudentsLoading(true);
    setCurrentPage(page);
    try {
      const response = await getStudents(page, pageSize);
      const allStudents = response.data.data || response.data || [];
      setStudents(allStudents);

      if (allStudents.length === pageSize) {
        setTotalPages(prev => Math.max(prev, page + 1));
      }

      const newStatuses = { ...markedStatuses };
      allStudents.forEach(s => {
        if (!newStatuses[s.id]) {
          newStatuses[s.id] = { status: 'present', remark: '', isSubmitted: false };
        }
      });
      setMarkedStatuses(newStatuses);
    } catch (error) {
      console.error(error);
      toast.error(getApiMessage(error, 'Failed to fetch students'));
    } finally {
      setIsStudentsLoading(false);
    }
  };

  const setStatus = (studentId, status) => {
    setMarkedStatuses(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status, isSubmitted: false }
    }));
  };

  const setRemark = (studentId, remark) => {
    setMarkedStatuses(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remark, isSubmitted: false }
    }));
  };

  const handleIndividualSubmit = async (studentId) => {
    if (!selectedClass || !selectedSubject) {
      toast.error('Please select both class and subject');
      return;
    }

    const data = markedStatuses[studentId];
    if (!data) return;

    setRowSubmitting(studentId);
    try {
      const payload = {
        date: new Date(attendanceDate).toISOString(),
        classId: parseInt(selectedClass),
        subjectId: parseInt(selectedSubject),
        students: [{
          studentId: studentId,
          status: data.status,
          remark: data.remark || ""
        }]
      };

      await markAttendance(payload);
      toast.success(`Attendance marked successfully!`);

      setMarkedStatuses(prev => ({
        ...prev,
        [studentId]: { ...prev[studentId], isSubmitted: true }
      }));
    } catch (error) {
      toast.error(getApiMessage(error, 'Failed to mark attendance.'));
    } finally {
      setRowSubmitting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="animate-spin text-[#0066cc] mb-4" size={40} />
        <p className="text-[#1d1d1f]/40 text-[12px] font-semibold uppercase tracking-[0.2em]">Preparing Workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Config Panel */}
      <div className="bg-white/90 backdrop-blur-xl border border-[#e0e0e0] rounded-[18px] p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-[12px] bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center">
            <ClipboardCheck size={22} />
          </div>
          <div>
            <h2 className="text-[22px] font-semibold font-['SF Pro Display'] text-[#1d1d1f] tracking-tight">Attendance Configuration</h2>
            <p className="text-[13px] text-[#1d1d1f]/50">Define parameters for the marking session.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40 px-1">Session Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d1d1f]/30" size={16} />
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-[#e0e0e0] rounded-full py-3 pl-11 pr-5 font-['SF Pro Text'] text-[14px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40 px-1">Class Section</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#e0e0e0] rounded-full py-3 px-5 font-['SF Pro Text'] text-[14px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Class</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name || c.className || `Class ${c.id}`}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40 px-1">Academic Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#e0e0e0] rounded-full py-3 px-5 font-['SF Pro Text'] text-[14px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Subject</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name || s.subjectName || `Subject ${s.id}`} {s.code ? `(${s.code})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => handleFetchStudents(1)}
              disabled={!selectedClass || isStudentsLoading}
              className="w-full bg-[#0066cc] text-white py-3 rounded-full font-['SF Pro Text'] text-[14px] font-semibold transition-all flex items-center justify-center gap-2 shadow-[rgba(0,102,204,0.3)_0_4px_12px] disabled:opacity-50"
            >
              {isStudentsLoading ? <Loader2 className="animate-spin" size={16} /> : (
                <>Initialize List <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Registry Section */}
      <AnimatePresence>
        {students.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden"
          >
            <div className="px-8 py-5 border-b border-[#e0e0e0] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-[18px] font-semibold font-['SF Pro Display'] text-[#1d1d1f]">Registry Entry</h3>
                <p className="text-[12px] text-[#1d1d1f]/50">Mark status and add remarks individually for each student.</p>
              </div>
              <button
                onClick={() => {
                  const bulk = { ...markedStatuses };
                  students.forEach(s => { bulk[s.id] = { ...bulk[s.id], status: 'present', isSubmitted: false }; });
                  setMarkedStatuses(bulk);
                }}
                className="bg-[#f5f5f7] text-[#1d1d1f]/50 px-5 py-2 rounded-full text-[11px] font-semibold hover:bg-[#e8e8ed] transition-all"
              >
                Reset Selection
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f5f5f7]/50">
                    <th className="px-8 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40">Student Info</th>
                    <th className="px-8 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40">Status</th>
                    <th className="px-8 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40">Observations</th>
                    <th className="px-8 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0]">
                  {students.map((s) => {
                    const studentData = markedStatuses[s.id] || { status: 'present', remark: '', isSubmitted: false };
                    return (
                      <motion.tr
                        key={s.id}
                        className={`group transition-all ${studentData.isSubmitted ? 'opacity-50 grayscale' : 'hover:bg-[#f5f5f7]/30'}`}
                      >
                        <td className="px-8 py-4">
                          <div className="text-[14px] font-semibold text-[#1d1d1f]">{s.fullName || `${s.firstName} ${s.lastName}`}</div>
                          <div className="text-[10px] text-[#1d1d1f]/40 mt-0.5">ID: #{s.id} &bull; {s.admissionNumber || 'N/A'}</div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {[
                              { id: 'present', icon: CheckCircle, label: 'P' },
                              { id: 'absent', icon: XCircle, label: 'A' },
                              { id: 'late', icon: Clock, label: 'L' }
                            ].map((btn) => (
                              <button
                                key={btn.id}
                                onClick={() => setStatus(s.id, btn.id)}
                                disabled={studentData.isSubmitted}
                                className={`w-10 h-10 flex flex-col items-center justify-center rounded-[10px] transition-all border-2 ${
                                  studentData.status === btn.id
                                  ? 'bg-[#0066cc] border-[#0066cc] text-white shadow-[rgba(0,102,204,0.3)_0_2px_8px]'
                                  : 'bg-white border-[#e0e0e0] text-[#1d1d1f]/30 hover:border-[#0066cc]/30 hover:text-[#0066cc]'
                                }`}
                              >
                                <btn.icon size={14} />
                                <span className="text-[7px] font-semibold mt-0.5">{btn.label}</span>
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <input
                            type="text"
                            placeholder="Add remark..."
                            value={studentData.remark}
                            onChange={(e) => setRemark(s.id, e.target.value)}
                            disabled={studentData.isSubmitted}
                            className="w-full bg-[#f5f5f7] border border-[#e0e0e0] rounded-[10px] py-2.5 px-4 font-['SF Pro Text'] text-[13px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30"
                          />
                        </td>
                        <td className="px-8 py-4 text-right">
                          <button
                            onClick={() => handleIndividualSubmit(s.id)}
                            disabled={rowSubmitting === s.id || studentData.isSubmitted}
                            className={`px-6 py-2.5 rounded-full text-[11px] font-semibold transition-all flex items-center justify-center gap-2 ml-auto ${
                              studentData.isSubmitted
                              ? 'bg-[#0066cc]/10 text-[#0066cc]'
                              : 'bg-[#0066cc] text-white shadow-[rgba(0,102,204,0.3)_0_4px_12px]'
                            }`}
                          >
                            {rowSubmitting === s.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : studentData.isSubmitted ? (
                              <CheckCircle size={14} />
                            ) : (
                              <Send size={14} />
                            )}
                            {studentData.isSubmitted ? 'Saved' : 'Mark'}
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-4 bg-[#f5f5f7]/30 border-t border-[#e0e0e0] flex items-center justify-between">
              <div className="text-[11px] text-[#1d1d1f]/40">
                Page <span className="text-[#1d1d1f] font-semibold">{currentPage}</span> of <span className="text-[#1d1d1f] font-semibold">{totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1 || isStudentsLoading}
                  onClick={() => handleFetchStudents(currentPage - 1)}
                  className="bg-white border border-[#e0e0e0] text-[#1d1d1f]/40 px-5 py-2 rounded-full text-[11px] font-semibold hover:border-[#0066cc]/30 hover:text-[#0066cc] disabled:opacity-30 transition-all"
                >
                  Prev
                </button>
                <button
                  disabled={currentPage === totalPages || isStudentsLoading}
                  onClick={() => handleFetchStudents(currentPage + 1)}
                  className="bg-white border border-[#e0e0e0] text-[#1d1d1f]/40 px-5 py-2 rounded-full text-[11px] font-semibold hover:border-[#0066cc]/30 hover:text-[#0066cc] disabled:opacity-30 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttendanceMarking;
