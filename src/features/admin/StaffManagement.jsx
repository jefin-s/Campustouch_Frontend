import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
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
import { getApiMessage } from '../../utils/apiMessage';

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
      const resolvedDetails = details.data || details || {};
      setSelectedStaff({
        ...staff,
        ...resolvedDetails,
        id:
          resolvedDetails.id ??
          resolvedDetails.staffId ??
          resolvedDetails.staffID ??
          staff.id,
        departmentId:
          resolvedDetails.departmentId ??
          resolvedDetails.departmentID ??
          resolvedDetails.department?.id ??
          staff.departmentId ??
          '',
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      toast.error(getApiMessage(error, 'Failed to fetch staff details'));
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
      console.error(error);
      toast.error(getApiMessage(error, 'Failed to delete staff'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalSubmit = async (formData, id) => {
    setIsSubmitting(true);
    try {
      if (id) {
        const response = await updateStaff(id, formData);
        toast.success(getApiMessage(response, 'Staff updated successfully!'));
      } else {
        const response = await createStaff(formData);
        toast.success(getApiMessage(response, 'Staff added successfully!'));
      }
      setIsModalOpen(false);
      setSelectedStaff(null);
      fetchStaff();
    } catch (error) {
      toast.error(getApiMessage(error, 'Failed to save staff'));
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

  const filteredStaffList = staffList.filter((staff) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const fullName = `${staff.firstName || ''} ${staff.lastName || ''}`.toLowerCase();
    return (
      fullName.includes(query) ||
      (staff.email || '').toLowerCase().includes(query) ||
      (staff.phoneNumber || '').toLowerCase().includes(query) ||
      (staff.designation || '').toLowerCase().includes(query)
    );
  });

  return (
    <>
      <ManagementTable 
        title="Staff Management"
        columns={columns}
        data={filteredStaffList}
        isLoading={isLoading}
        onAdd={() => {
          setSelectedStaff(null);
          setIsModalOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        pagination={{
          total: filteredStaffList.length,
          pageSize: Math.max(filteredStaffList.length, 1),
          current: 1,
        }}
        searchPlaceholder="Search staff by name, email, phone, or designation..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
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
