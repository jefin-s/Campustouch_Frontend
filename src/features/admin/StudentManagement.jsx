import { useState, useEffect, useCallback } from 'react';
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

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });

  const fetchStudents = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getStudents(page, pagination.pageSize);
      
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
    fetchStudents();
  }, [fetchStudents]);

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      await deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
      fetchStudents(pagination.current);
    } catch (error) {
      console.error(error);
      alert('Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async (student) => {
    setIsLoading(true);
    try {
      const details = await getStudentById(student.id);
      setSelectedStudent(details.data || details);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch student details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = async (formData, id) => {
    setIsSubmitting(true);
    try {
      if (id) {
        await updateStudent(id, formData);
        alert('Student updated successfully!');
      } else {
        await createStudent(formData);
        alert('Student added successfully!');
      }
      setIsModalOpen(false);
      setSelectedStudent(null);
      fetchStudents(id ? pagination.current : 1);
    } catch (error) {
      console.error('Submission error:', error);
      alert(error.message || 'Failed to save student. Please check all fields.');
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
          {row.isActive ? 'Active' : 'Inactive'}
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
            onClick={() => fetchStudents(pagination.current)} 
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
      <ManagementTable 
        title="Student Management"
        columns={columns}
        data={students}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={(page) => fetchStudents(page)}
        onDelete={handleDeleteClick}
        onEdit={handleEdit}
        onAdd={handleAddClick}
        searchPlaceholder="Search by email or username..."
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
