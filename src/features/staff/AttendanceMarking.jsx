import { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle,
  Save, Loader2, ClipboardCheck, Clock, Send, Calendar, ChevronRight, Edit2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { markAttendance, updateAttendance, getAttendanceReport } from '../../services/attendanceService';
import { classService, subjectService } from '../../services/academicServices';
import { getStudents } from '../../services/studentService';
import { getApiMessage } from '../../utils/apiMessage';

const AttendanceUpdateModal = ({ isOpen, onClose, student, statusData, onSave, isSubmitting }) => {
  const [status, setStatus] = useState(statusData?.status || 'present');
  const [remark, setRemark] = useState(statusData?.remark || '');

  useEffect(() => {
    if (isOpen) {
      setStatus(statusData?.status || 'present');
      setRemark(statusData?.remark || '');
    }
  }, [isOpen, statusData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1d1d1f]/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-md rounded-[24px] shadow-2xl border border-[#e0e0e0] overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-[#e0e0e0] flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-semibold text-[#1d1d1f]">Update Attendance</h3>
            <p className="text-[12px] text-[#1d1d1f]/50">
              Editing for: <span className="text-[#0066cc] font-medium">{student?.fullName || `${student?.firstName} ${student?.lastName}`}</span>
            </p>
            <div className="flex gap-3 mt-1">
              <span className="text-[9px] font-bold bg-[#f5f5f7] px-2 py-0.5 rounded text-[#1d1d1f]/40 uppercase">SID: #{student?.id}</span>
              {statusData?.attendanceId && (
                <span className="text-[9px] font-bold bg-[#0066cc]/5 px-2 py-0.5 rounded text-[#0066cc]/60 uppercase">AID: #{statusData.attendanceId}</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#f5f5f7] rounded-full transition-all">
            <X size={20} className="text-[#1d1d1f]/40" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#1d1d1f]/40 px-1">Revision Status</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'present', label: 'Present', icon: CheckCircle, color: 'bg-[#059669]' },
                { id: 'absent', label: 'Absent', icon: XCircle, color: 'bg-[#dc2626]' },
                { id: 'late', label: 'Late', icon: Clock, color: 'bg-[#d97706]' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setStatus(item.id)}
                  className={`flex flex-col items-center justify-center py-4 rounded-[16px] border-2 transition-all ${
                    status === item.id 
                    ? `border-[#0066cc] bg-[#0066cc]/5 text-[#0066cc]` 
                    : 'border-[#e0e0e0] text-[#1d1d1f]/40 hover:border-[#0066cc]/30'
                  }`}
                >
                  <item.icon size={20} className={status === item.id ? 'text-[#0066cc]' : 'text-[#1d1d1f]/20'} />
                  <span className="text-[11px] font-bold mt-2">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#1d1d1f]/40 px-1">Amendment Remark</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Provide reason for update..."
              className="w-full h-24 bg-[#f5f5f7] border border-[#e0e0e0] rounded-[16px] p-4 text-[13px] focus:outline-none focus:border-[#0066cc] transition-all resize-none"
            />
          </div>
        </div>

        <div className="px-8 py-6 bg-[#f5f5f7]/50 border-t border-[#e0e0e0] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-full text-[13px] font-semibold text-[#1d1d1f]/50 hover:bg-[#e0e0e0] transition-all"
          >
            Discard
          </button>
          <button
            onClick={() => onSave(status, remark)}
            disabled={isSubmitting}
            className="flex-1 bg-[#1d1d1f] text-white py-3.5 rounded-full text-[13px] font-semibold shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Commit Update
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AttendanceMarking = () => {
  const [editingStudent, setEditingStudent] = useState(null);
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  const [students, setStudents] = useState([]);
  const [markedStatuses, setMarkedStatuses] = useState({});
  const [currentAttendanceId, setCurrentAttendanceId] = useState(null);

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
        
        const classesData = classRes.data?.data || classRes.data || (Array.isArray(classRes) ? classRes : []);
        const subjectsData = subRes.data?.data || subRes.data || (Array.isArray(subRes) ? subRes : []);
        
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
      const [studentsRes, reportRes] = await Promise.all([
        getStudents(page, pageSize),
        getAttendanceReport({
          ClassId: selectedClass,
          SubjectId: selectedSubject,
          Date: attendanceDate
        }).catch(() => null)
      ]);
      
      const res = studentsRes;
      const allStudents = res.data?.items || res.data?.data || res.data || (Array.isArray(res) ? res : []);
      const totalCount = res.data?.totalCount || res.data?.total || res.totalCount || res.total || (Array.isArray(allStudents) ? allStudents.length : 0);
      
      if (Array.isArray(allStudents)) {
        setStudents(allStudents);
        setTotalPages(Math.ceil(totalCount / pageSize) || 1);
      } else {
        setStudents([]);
        setTotalPages(1);
      }

      // Handle Existing Session ID & Load Statuses
      const reportData = reportRes?.data?.items || reportRes?.data || reportRes || [];
      const newStatuses = {}; 
      
      if (Array.isArray(reportData) && reportData.length > 0) {
        // Find the most relevant session ID
        const sessionRecord = reportData.find(r => r.attendanceId || r.id);
        if (sessionRecord) {
          setCurrentAttendanceId(sessionRecord.attendanceId || sessionRecord.id);
        }

        reportData.forEach(record => {
          if (record.studentId) {
            newStatuses[record.studentId] = {
              status: record.status?.toLowerCase() || 'present',
              remark: record.remark || '',
              isSubmitted: true,
              attendanceId: record.attendanceId || record.id // Store the specific ID
            };
          }
        });
      } else {
        setCurrentAttendanceId(null);
      }

      if (Array.isArray(allStudents)) {
        allStudents.forEach(s => {
          if (!newStatuses[s.id]) {
            newStatuses[s.id] = { status: 'present', remark: '', isSubmitted: false };
          }
        });
      }
      setMarkedStatuses(newStatuses);
    } catch (error) {
      console.error(error);
      toast.error(getApiMessage(error, 'Failed to initialize list'));
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
      // Each student can be marked independently.
      // Only update if THIS SPECIFIC student has an attendanceId.
      if (data.attendanceId) {
        await updateAttendance({
          attendanceId: parseInt(data.attendanceId),
          students: [{
            studentId: parseInt(studentId),
            status: data.status,
            remark: data.remark || ""
          }]
        });
        toast.success(`Attendance updated successfully!`);
      } else {
        const payload = {
          date: new Date(attendanceDate).toISOString(),
          classId: parseInt(selectedClass),
          subjectId: parseInt(selectedSubject),
          students: [{
            studentId: parseInt(studentId),
            status: data.status,
            remark: data.remark || ""
          }]
        };

        const response = await markAttendance(payload);
        const resData = response?.data || response;
        const newId = resData?.attendanceId || resData?.id;
        
        setMarkedStatuses(prev => ({
          ...prev,
          [studentId]: { 
            ...prev[studentId], 
            isSubmitted: true,
            attendanceId: newId
          }
        }));
        toast.success(`Attendance marked successfully!`);
      }
    } catch (error) {
      toast.error(getApiMessage(error, 'Failed to save attendance.'));
    } finally {
      setRowSubmitting(null);
    }
  };

  const handleModalSave = async (status, remark) => {
    const studentId = editingStudent?.id || editingStudent?.studentId;
    const studentStatusData = markedStatuses[studentId];
    const attendanceId = studentStatusData?.attendanceId || currentAttendanceId;

    if (!attendanceId || !studentId) {
      toast.error(`Cannot update: Missing ID Context`);
      return;
    }
    
    const payload = {
      attendanceId: parseInt(attendanceId),
      students: [{
        studentId: parseInt(studentId),
        status: status,
        remark: remark || ""
      }]
    };

    setIsModalSubmitting(true);
    try {
      await updateAttendance(payload);
      
      setMarkedStatuses(prev => ({
        ...prev,
        [studentId]: { 
          ...prev[studentId], 
          status, 
          remark, 
          isSubmitted: true 
        }
      }));
      
      toast.success('Attendance updated successfully!');
      setEditingStudent(null);
    } catch (error) {
      console.error('Update API Error:', error);
      toast.error(getApiMessage(error, 'Failed to update attendance'));
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const handleBulkSubmit = async () => {
    if (students.length === 0) return;
    
    setIsStudentsLoading(true);
    try {
      const studentPayloads = students.map(s => ({
        studentId: parseInt(s.id),
        status: markedStatuses[s.id]?.status || 'present',
        remark: markedStatuses[s.id]?.remark || ""
      }));

      let newId = currentAttendanceId;

      if (currentAttendanceId) {
        await updateAttendance({
          attendanceId: parseInt(currentAttendanceId),
          students: studentPayloads
        });
      } else {
        const response = await markAttendance({
          date: new Date(attendanceDate).toISOString(),
          classId: parseInt(selectedClass),
          subjectId: parseInt(selectedSubject),
          students: studentPayloads
        });
        const resData = response?.data || response;
        newId = resData?.attendanceId || resData?.id;
        if (newId) setCurrentAttendanceId(newId);
      }

      toast.success('Session saved successfully!');
      
      setMarkedStatuses(prev => {
        const bulk = { ...prev };
        students.forEach(s => { 
          bulk[s.id] = { 
            ...bulk[s.id], 
            isSubmitted: true,
            attendanceId: newId 
          }; 
        });
        return bulk;
      });
    } catch (err) {
      toast.error(getApiMessage(err, 'Failed to save session'));
    } finally {
      setIsStudentsLoading(false);
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Config Panel */}
      <div className="bg-white/90 backdrop-blur-xl border border-[#e0e0e0] rounded-[24px] p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-[14px] bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center">
            <ClipboardCheck size={22} />
          </div>
          <div>
            <h2 className="text-[26px] font-bold font-['SF Pro Display'] text-[#1d1d1f] tracking-tight">Attendance Management</h2>
            <p className="text-[14px] text-[#1d1d1f]/50">Configure and process attendance for your classes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#1d1d1f]/40 px-1">Session Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d1d1f]/30" size={16} />
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-[#e0e0e0] rounded-full py-3.5 pl-11 pr-5 font-['SF Pro Text'] text-[14px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#1d1d1f]/40 px-1">Target Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#e0e0e0] rounded-full py-3.5 px-6 font-['SF Pro Text'] text-[14px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] appearance-none cursor-pointer"
            >
              <option value="">Select Class</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name || c.className || `Class ${c.id}`}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#1d1d1f]/40 px-1">Academic Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#e0e0e0] rounded-full py-3.5 px-6 font-['SF Pro Text'] text-[14px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] appearance-none cursor-pointer"
            >
              <option value="">Select Subject</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name || s.subjectName} {s.code && `(${s.code})`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => handleFetchStudents(1)}
              disabled={!selectedClass || isStudentsLoading}
              className="w-full bg-[#0066cc] text-white py-3.5 rounded-full text-[14px] font-bold transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_-5px_rgba(0,102,204,0.3)] disabled:opacity-50"
            >
              {isStudentsLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <>{currentAttendanceId ? 'Refresh Session' : 'Initialize List'} <ChevronRight size={18} /></>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {students.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
                <div className="px-8 py-5 border-b border-[#e0e0e0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-[18px] font-semibold font-['SF Pro Display'] text-[#1d1d1f]">Registry Entry</h3>
                      <p className="text-[12px] text-[#1d1d1f]/50">Mark status and add remarks individually.</p>
                    </div>
                    {currentAttendanceId && (
                      <div className="bg-[#059669]/10 text-[#059669] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#059669]/20 flex items-center gap-1.5 animate-pulse">
                        <Save size={10} /> Update Mode
                      </div>
                    )}
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
                          <motion
                            key={s.id}
                            className={`group transition-all ${studentData.isSubmitted ? 'bg-[#f5f5f7]/20' : 'hover:bg-[#f5f5f7]/30'}`}
                          >
                            <td className="px-8 py-4">
                              <div className="text-[14px] font-semibold text-[#1d1d1f]">{s.fullName || `${s.firstName} ${s.lastName}`}</div>
                              <div className="text-[10px] text-[#1d1d1f]/40 mt-0.5">ID: #{s.id} &bull; {s.admissionNumber || 'N/A'}</div>
                            </td>
                            <td className="px-8 py-4">
                              <div className="flex items-center justify-center gap-2">
                                {studentData.isSubmitted ? (
                                  <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border-2 flex items-center gap-2 ${
                                    studentData.status === 'present' ? 'bg-[#059669]/10 border-[#059669]/20 text-[#059669]' :
                                    studentData.status === 'absent' ? 'bg-[#dc2626]/10 border-[#dc2626]/20 text-[#dc2626]' :
                                    'bg-[#d97706]/10 border-[#d97706]/20 text-[#d97706]'
                                  }`}>
                                    {studentData.status === 'present' ? <CheckCircle size={12} /> : 
                                     studentData.status === 'absent' ? <XCircle size={12} /> : <Clock size={12} />}
                                    {studentData.status}
                                  </div>
                                ) : (
                                  [
                                    { id: 'present', icon: CheckCircle, label: 'P' },
                                    { id: 'absent', icon: XCircle, label: 'A' },
                                    { id: 'late', icon: Clock, label: 'L' }
                                  ].map((btn) => (
                                    <button
                                      key={btn.id}
                                      onClick={() => setStatus(s.id, btn.id)}
                                      className={`w-10 h-10 flex flex-col items-center justify-center rounded-[10px] transition-all border-2 ${
                                        studentData.status === btn.id
                                        ? 'bg-[#0066cc] border-[#0066cc] text-white shadow-[rgba(0,102,204,0.3)_0_2px_8px]'
                                        : 'bg-white border-[#e0e0e0] text-[#1d1d1f]/30 hover:border-[#0066cc]/30 hover:text-[#0066cc]'
                                      }`}
                                    >
                                      <btn.icon size={14} />
                                      <span className="text-[7px] font-semibold mt-0.5">{btn.label}</span>
                                    </button>
                                  ))
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-4">
                              {studentData.isSubmitted ? (
                                <div className="text-[13px] text-[#1d1d1f]/60 font-medium italic">
                                  {studentData.remark || "No observations recorded."}
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  placeholder="Add remark..."
                                  value={studentData.remark}
                                  onChange={(e) => setRemark(s.id, e.target.value)}
                                  className="w-full bg-[#f5f5f7] border border-[#e0e0e0] rounded-[10px] py-2.5 px-4 font-['SF Pro Text'] text-[13px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30"
                                />
                              )}
                            </td>
                            <td className="px-8 py-4 text-right">
                              {studentData.isSubmitted ? (
                                <button
                                  onClick={() => setEditingStudent(s)}
                                  className="px-6 py-2.5 rounded-full text-[11px] font-semibold transition-all flex items-center justify-center gap-2 ml-auto bg-[#1d1d1f] text-white shadow-lg hover:bg-black"
                                >
                                  <Edit2 size={14} /> Update
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleIndividualSubmit(s.id)}
                                  disabled={rowSubmitting === s.id}
                                  className="px-6 py-2.5 rounded-full text-[11px] font-semibold transition-all flex items-center justify-center gap-2 ml-auto bg-[#0066cc] text-white shadow-[rgba(0,102,204,0.3)_0_4px_12px]"
                                >
                                  {rowSubmitting === s.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                  Mark
                                </button>
                              )}
                            </td>
                          </motion>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="px-8 py-6 bg-[#f5f5f7]/30 border-t border-[#e0e0e0] flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="text-[11px] text-[#1d1d1f]/40">
                      Page <span className="text-[#1d1d1f] font-semibold">{currentPage}</span> of <span className="text-[#1d1d1f] font-semibold">{totalPages}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentPage === 1 || isStudentsLoading}
                        onClick={() => handleFetchStudents(currentPage - 1)}
                        className="bg-white border border-[#e0e0e0] text-[#1d1d1f]/40 px-5 py-2 rounded-full text-[11px] font-semibold disabled:opacity-30"
                      >
                        Prev
                      </button>
                      <button
                        disabled={currentPage === totalPages || isStudentsLoading}
                        onClick={() => handleFetchStudents(currentPage + 1)}
                        className="bg-white border border-[#e0e0e0] text-[#1d1d1f]/40 px-5 py-2 rounded-full text-[11px] font-semibold disabled:opacity-30"
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleBulkSubmit}
                    disabled={isStudentsLoading}
                    className="w-full md:w-auto bg-[#1d1d1f] text-white px-10 py-3 rounded-full text-[13px] font-semibold flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
                  >
                    {isStudentsLoading ? <Loader2 className="animate-spin" size={18} /> : (
                      <>
                        <Save size={18} />
                        {currentAttendanceId ? 'Update Session' : 'Mark Session'}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
        )}
      </AnimatePresence>

      <AttendanceUpdateModal
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        student={editingStudent}
        statusData={markedStatuses[editingStudent?.id]}
        isSubmitting={isModalSubmitting}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default AttendanceMarking;
