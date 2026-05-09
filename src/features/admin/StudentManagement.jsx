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
  updateStudent,
  approveStudent
} from '../../services/studentService';
import { getApiMessage } from '../../utils/apiMessage';

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
  const [isApprovingAll, setIsApprovingAll] = useState(false);
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
      const response = await getStudents(page, pagination.pageSize, search);
      
      // Based on your response structure: { success: true, data: [...] }
      if (response && response.data && Array.isArray(response.data)) {
        setStudents(response.data);
        // If your API doesn't return totalCount, we'll estimate it for now
        setPagination(prev => ({ 
          ...prev, 
          current: page, 
          total: response.totalCount || response.data.length 
        }));
      } else {
        setStudents([]);
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

  const handleApproveAllApplicants = async () => {
    setIsApprovingAll(true);
    try {
      const basePageSize = Math.max(pagination.pageSize, 100);
      const firstPageResponse = await getStudents(1, basePageSize);
      const firstPageData = Array.isArray(firstPageResponse?.data) ? firstPageResponse.data : [];
      const totalCount = firstPageResponse?.totalCount || firstPageData.length;

      let allRows = [...firstPageData];
      let currentPage = 2;

      while (allRows.length < totalCount) {
        const response = await getStudents(currentPage, basePageSize);
        const pageRows = Array.isArray(response?.data) ? response.data : [];
        if (pageRows.length === 0) break;
        allRows = allRows.concat(pageRows);
        currentPage += 1;
      }

      const allApplicants = allRows.filter((student) => isApplicantRecord(student));
      if (allApplicants.length === 0) {
        toast('No pending applicants found for approval.');
        return;
      }

      const results = await Promise.all(
        allApplicants.map(async (applicant) => {
          const resolvedId = getResolvedStudentId(applicant);
          if (!resolvedId) {
            return { status: 'skipped' };
          }

          try {
            await approveStudent(resolvedId);
            return { status: 'approved' };
          } catch (approvalError) {
            console.error('Failed to approve applicant:', approvalError);
            return { status: 'failed' };
          }
        })
      );

      const approvedCount = results.filter((result) => result.status === 'approved').length;
      const failedCount = results.filter((result) => result.status === 'failed').length;
      const skippedCount = results.filter((result) => result.status === 'skipped').length;

      if (approvedCount > 0) {
        toast.success(`${approvedCount} applicant${approvedCount > 1 ? 's' : ''} approved successfully.`);
      }
      if (failedCount > 0) {
        toast.error(`Failed to approve ${failedCount} applicant${failedCount > 1 ? 's' : ''}.`);
      }
      if (skippedCount > 0) {
        toast(`${skippedCount} record${skippedCount > 1 ? 's were' : ' was'} skipped (missing ID).`);
      }

      fetchStudents(pagination.current, debouncedSearchQuery);
    } finally {
      setIsApprovingAll(false);
    }
  };

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
    if (selectedStudent && !id) {
      toast.error('Student ID is missing for update. Please reopen edit and try again.');
      return;
    }

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
      toast.error(getApiMessage(error, 'Failed to save student. Please check all fields.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddClick = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const columns = [
    { 
      header: 'Student', 
      accessor: 'fullName',
      render: (row) => (
        <div className="user-cell">
          <div className="user-avatar">
            {(row.profileImageUrl || row.profileImagePath) ? (
              <img src={row.profileImageUrl || row.profileImagePath} alt={row.fullName} />
            ) : (
              <div className="avatar-placeholder">
                {row.fullName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-info-text">
            <div className="user-name-bold">{row.fullName}</div>
            <div className="user-email-muted">{row.email}</div>
          </div>
        </div>
      )
    },
    { header: 'Admission No', accessor: 'admissionNumber' },
    { 
      header: 'Status', 
      accessor: 'isActive', 
      render: (row) => (
        <span className={`status-chip ${row.isActive ? 'active' : 'pending'}`}>
          {isApplicantRecord(row) ? 'Applicant' : row.isActive ? 'Active' : 'Inactive'}
        </span>
      ) 
    }
  ];

  return (
    <>
      {error && (
        <div style={{
          background: 'rgba(255, 59, 48, 0.1)',
          border: '1px solid rgba(255, 59, 48, 0.3)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          color: '#ff3b30',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <div>
            <strong>Backend Error:</strong> {error}
            <br />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
              Please check if the backend server is running and configured correctly.
            </span>
          </div>
          <button 
            onClick={() => fetchStudents(pagination.current, debouncedSearchQuery)} 
            style={{
              marginLeft: 'auto',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              padding: '6px 16px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Retry
          </button>
        </div>
      )}

      <div className="approval-section-banner">
        <div className="approval-section-meta">
          <h3>Approval Section</h3>
          <p>Approve all applicants and move them to student role.</p>
        </div>
        <button
          className="approve-all-btn"
          onClick={handleApproveAllApplicants}
          disabled={isApprovingAll}
        >
          {isApprovingAll ? 'Approving...' : 'Approve All Applicants'}
        </button>
      </div>

      <ManagementTable 
        title="Student Management"
        columns={columns}
        data={students}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={(page) => fetchStudents(page, debouncedSearchQuery)}
        onDelete={handleDeleteClick}
        onEdit={handleEdit}
        onAdd={handleAddClick}
        searchPlaceholder="Search by email or username..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

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
    </>
  );
};

export default StudentManagement;
