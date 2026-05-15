import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import ManagementTable from './ManagementTable';
import StudentModal from './StudentModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import {
  getStudents,
  getStudentById,
  deleteStudent,
  createStudent,
  updateStudent
} from '../../services/studentService';
import { getApiMessage } from '../../utils/apiMessage';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw, GraduationCap, Users, Mail, Sparkles } from 'lucide-react';

const normalizeValue = (value) => String(value ?? '').trim().toLowerCase();

const getResolvedStudentId = (student) =>
  student?.id ?? student?.studentId ?? student?.studentID ?? student?.userId ?? null;

const hasApplicantRole = (student) => {
  const role = normalizeValue(student?.role ?? student?.userRole ?? student?.currentRole);
  if (role === 'applicant') return true;

  if (Array.isArray(student?.roles)) {
    return student.roles.some((item) => normalizeValue(item) === 'applicant');
  }

  return false;
};

const hasPendingApprovalFlag = (student) => {
  const approvalState = normalizeValue(student?.approvalStatus ?? student?.status ?? student?.applicationStatus);
  return approvalState === 'pending' || approvalState === 'applicant';
};

const isApplicantRecord = (student) => {
  if (!student || typeof student !== 'object') return false;

  if (student?.isApproved === false) return true;
  if (hasApplicantRole(student)) return true;
  if (hasPendingApprovalFlag(student)) return true;

  return false;
};

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchStudents = useCallback(async (page = 1, search = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getStudents(page, pagination.pageSize, search);
      
      // Robustly handle backend response structures
      // The user provided format: res.data.items
      const rowData = res.data?.items || res.data?.data || res.data || (Array.isArray(res) ? res : []);
      const totalCount = res.data?.totalCount || res.data?.total || res.totalCount || res.total || (Array.isArray(rowData) ? rowData.length : 0);

      if (Array.isArray(rowData)) {
        setStudents(rowData);
        setPagination(prev => ({
          ...prev,
          current: page,
          total: totalCount
        }));
      } else {
        setStudents([]);
        setPagination(prev => ({ ...prev, current: page, total: 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      const errMsg = error?.message || error?.response?.data?.message || 'Failed to fetch students. Please check if the backend is running.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.pageSize]);

  useEffect(() => {
    fetchStudents(1, debouncedSearchQuery);
  }, [fetchStudents, debouncedSearchQuery]);

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      await deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
      fetchStudents(pagination.current, debouncedSearchQuery);
    } catch (error) {
      console.error(error);
      toast.error(getApiMessage(error, 'Failed to delete student'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async (student) => {
    setIsLoading(true);
    try {
      const details = await getStudentById(student.id);
      const resolvedDetails = details.data || details || {};
      const resolvedId =
        resolvedDetails.id ??
        resolvedDetails.studentId ??
        resolvedDetails.studentID ??
        student.id;

      setSelectedStudent({
        ...resolvedDetails,
        id: resolvedId,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      toast.error(getApiMessage(error, 'Failed to fetch student details'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = async (formData, id) => {
    setIsSubmitting(true);
    try {
      if (id) {
        const response = await updateStudent(id, formData);
        toast.success(getApiMessage(response, 'Student updated successfully!'));
      } else {
        const response = await createStudent(formData);
        toast.success(getApiMessage(response, 'Student added successfully!'));
      }
      setIsModalOpen(false);
      setSelectedStudent(null);
      fetchStudents(id ? pagination.current : 1, debouncedSearchQuery);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(getApiMessage(error, 'Failed to save student.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Student',
      accessor: 'fullName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center font-semibold text-[15px] overflow-hidden">
            {(row.profileImageUrl || row.profileImagePath) ? (
              <img src={row.profileImageUrl || row.profileImagePath} alt={row.fullName} className="w-full h-full object-cover" />
            ) : (
              row.fullName?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold font-['SF Pro Text'] text-[#1d1d1f]">{row.fullName}</span>
            <div className="flex items-center gap-1.5">
              <Mail size={10} className="text-[#1d1d1f]/30" />
              <span className="text-[11px] font-['SF Pro Text'] text-[#1d1d1f]/40">{row.email}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Admission No',
      accessor: 'admissionNumber',
      render: (row) => <span className="font-mono text-[12px] font-medium text-[#1d1d1f]/50">{row.admissionNumber || '—'}</span>
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (row) => {
        const isApp = isApplicantRecord(row);
        return (
          <span className={`
            px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em]
            ${isApp ? 'bg-[#f5f5f7] text-[#1d1d1f]/60' : row.isActive ? 'bg-[#0066cc]/10 text-[#0066cc]' : 'bg-[#f5f5f7] text-[#1d1d1f]/40'}
          `}>
            {isApp ? 'Applicant' : row.isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 space-y-8">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#fef2f2] border border-[#fecaca] rounded-[14px] p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center text-red-500 shadow-sm">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#991b1b] text-[13px] mb-0.5">Connection Error</h4>
              <p className="text-red-500/70 text-[12px] font-['SF Pro Text'] leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => fetchStudents(pagination.current, debouncedSearchQuery)}
              className="p-2.5 bg-white hover:bg-[#fef2f2] text-red-500 rounded-[10px] transition-all shadow-sm"
            >
              <RefreshCw size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[#272729] rounded-[18px] shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px]"
      >
        <div className="relative z-10 px-8 py-10 lg:px-10 lg:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-[14px] bg-[#0066cc] flex items-center justify-center text-white shadow-[rgba(0,102,204,0.3)_0_4px_12px]">
                <Users size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-[#0066cc]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0066cc]">Student Directory</span>
                </div>
                <h2 className="text-[28px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] text-white mb-1">
                  Student Directory
                </h2>
                <p className="text-[15px] font-['SF Pro Text'] text-white/50 max-w-md">
                  Manage institutional records, oversee academic status, and streamline the enrollment lifecycle.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-full border border-white/10">
              <div className="text-center">
                <span className="block text-[32px] font-semibold font-['SF Pro Display'] text-white">{pagination.total}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">Total Scholars</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066cc]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#0066cc]/5 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ManagementTable
          title="Scholastic Records"
          columns={columns}
          data={students}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={(page) => fetchStudents(page, debouncedSearchQuery)}
          onDelete={handleDeleteClick}
          onEdit={handleEdit}
          onAdd={() => { setSelectedStudent(null); setIsModalOpen(true); }}
          searchPlaceholder="Filter records by name, ID or email..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </motion.div>

      {/* Modals */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        onSubmit={handleModalSubmit}
        isLoading={isSubmitting}
        initialData={selectedStudent}
      />

      <DeleteConfirmModal
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={studentToDelete?.fullName}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default StudentManagement;