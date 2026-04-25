import React, { useState, useEffect, useCallback } from 'react';
import ManagementTable from './ManagementTable';
import StaffModal from './StaffModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { 
  getAllStaff, 
  getStaffById, 
  createStaff, 
  updateStaff, 
  deleteStaff 
} from '../../services/staffService';

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffToDelete, setStaffToDelete] = useState(null);

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllStaff();
      // Adjusting to your response structure { success: true, data: [...] }
      if (response && response.data && Array.isArray(response.data)) {
        setStaffList(response.data);
      } else if (Array.isArray(response)) {
        setStaffList(response);
      } else {
        setStaffList([]);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleEdit = async (staff) => {
    setIsLoading(true);
    try {
      const details = await getStaffById(staff.id);
      setSelectedStaff(details.data || details);
      setIsModalOpen(true);
    } catch (error) {
      alert('Failed to fetch staff details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (staff) => {
    setStaffToDelete(staff);
  };

  const handleConfirmDelete = async () => {
    if (!staffToDelete) return;
    setIsDeleting(true);
    try {
      await deleteStaff(staffToDelete.id);
      setStaffToDelete(null);
      fetchStaff();
    } catch (error) {
      alert('Failed to delete staff');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalSubmit = async (formData, id) => {
    setIsSubmitting(true);
    try {
      if (id) {
        await updateStaff(id, formData);
        alert('Staff updated successfully!');
      } else {
        await createStaff(formData);
        alert('Staff added successfully!');
      }
      setIsModalOpen(false);
      setSelectedStaff(null);
      fetchStaff();
    } catch (error) {
      alert(error.message || 'Failed to save staff');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'firstName', render: (row) => `${row.firstName} ${row.lastName}` },
    { header: 'Designation', accessor: 'designation' },
    { header: 'Phone', accessor: 'phoneNumber' },
    { header: 'Email', accessor: 'email' },
    { header: 'Dept ID', accessor: 'departmentId' }
  ];

  return (
    <>
      <ManagementTable 
        title="Staff Management"
        columns={columns}
        data={staffList}
        isLoading={isLoading}
        onAdd={() => {
          setSelectedStaff(null);
          setIsModalOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        pagination={{ total: staffList.length, pageSize: staffList.length, current: 1 }}
      />

      <StaffModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStaff(null);
        }}
        onSubmit={handleModalSubmit}
        isLoading={isSubmitting}
        initialData={selectedStaff}
      />

      <DeleteConfirmModal 
        isOpen={!!staffToDelete}
        onClose={() => setStaffToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={staffToDelete ? `${staffToDelete.firstName} ${staffToDelete.lastName}` : ''}
        isLoading={isDeleting}
      />
    </>
  );
};

export default StaffManagement;
