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
import { departmentService } from '../../services/academicServices';
import { getApiMessage } from '../../utils/apiMessage';
import { motion } from 'framer-motion';
import { Shield, Mail, Phone, Building2, Briefcase, Plus, Sparkles } from 'lucide-react';

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });

  const fetchStaff = useCallback(async (page = 1, search = '') => {
    setIsLoading(true);
    try {
      const [staffRes, deptRes] = await Promise.all([
        getAllStaff(page, pagination.pageSize, search),
        departmentService.getAll()
      ]);

      // Robustly handle backend response structures (nested or direct)
      // Including support for the res.data.items format
      const rowData = staffRes.data?.items || staffRes.data?.data || staffRes.data || staffRes || [];
      const totalCount = staffRes.data?.totalCount || staffRes.data?.total || staffRes.totalCount || staffRes.total || (Array.isArray(rowData) ? rowData.length : 0);

      if (Array.isArray(rowData)) {
        setStaffList(rowData);
        setPagination(prev => ({
          ...prev,
          current: page,
          total: totalCount
        }));
      } else {
        setStaffList([]);
        setPagination(prev => ({ ...prev, current: page, total: 0 }));
      }

      setDepartments(deptRes.data?.data || deptRes.data || []);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      toast.error(getApiMessage(error, 'Failed to fetch staff list'));
    } finally {
      setIsLoading(false);
    }
  }, [pagination.pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStaff(1, searchQuery);
    }, 400); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchStaff, searchQuery]);

  const handleEdit = async (staff) => {
    setIsLoading(true);
    try {
      const details = await getStaffById(staff.id);
      const resolvedDetails = details.data || details || {};
      setSelectedStaff({
        ...staff,
        ...resolvedDetails,
        id: resolvedDetails.id ?? resolvedDetails.staffId ?? resolvedDetails.staffID ?? staff.id,
        departmentId: resolvedDetails.departmentId ?? resolvedDetails.departmentID ?? resolvedDetails.department?.id ?? staff.departmentId ?? '',
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
    {
      header: 'Faculty Member',
      accessor: 'firstName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center font-semibold text-[14px]">
            {row.firstName?.charAt(0)}{row.lastName?.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#1d1d1f]">{row.firstName} {row.lastName}</span>
            <span className="text-[11px] text-[#1d1d1f]/40 flex items-center gap-1">
              <Mail size={10} />
              {row.email}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Designation',
      accessor: 'designation',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-[13px] text-[#1d1d1f]/60">
          <Briefcase size={13} className="text-[#0066cc]" />
          {row.designation}
        </div>
      )
    },
    {
      header: 'Department',
      accessor: 'departmentId',
      render: (row) => {
        const id = row.departmentId || row.departmentID || row.DepartmentId || row.department?.id;
        const deptName = departments.find(d => String(d.id) === String(id))?.name || id || 'N/A';
        return (
          <div className="flex items-center gap-1.5 text-[13px] text-[#0066cc]">
            <Building2 size={13} />
            {deptName}
          </div>
        );
      }
    },
    {
      header: 'Contact',
      accessor: 'phoneNumber',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-[13px] text-[#1d1d1f]/40 font-mono">
          <Phone size={13} />
          {row.phoneNumber || 'N/A'}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
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
                <Shield size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-[#0066cc]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0066cc]">Faculty Management</span>
                </div>
                <h2 className="text-[28px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] text-white mb-1">
                  Faculty Management
                </h2>
                <p className="text-[15px] font-['SF Pro Text'] text-white/50 max-w-md">
                  Oversee institutional staff, assign departmental roles, and manage academic professional profiles.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center px-5 py-3 bg-white/5 rounded-full border border-white/10">
                <span className="block text-[22px] font-semibold font-['SF Pro Display'] text-white">{pagination.total}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">Total Faculty</span>
              </div>
              <button
                onClick={() => { setSelectedStaff(null); setIsModalOpen(true); }}
                className="flex items-center gap-2 bg-[#0066cc] hover:bg-[#0071e3] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all shadow-[rgba(0,102,204,0.3)_0_4px_12px] group"
              >
                <Plus size={16} />
                Add Member
              </button>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066cc]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#0066cc]/5 rounded-full blur-3xl"></div>
      </motion.div>

      <ManagementTable
        title="Institutional Staff"
        columns={columns}
        data={staffList}
        isLoading={isLoading}
        onAdd={() => { setSelectedStaff(null); setIsModalOpen(true); }}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        pagination={pagination}
        onPageChange={(page) => fetchStaff(page, searchQuery)}
        searchPlaceholder="Locate faculty by name, department or designation..."
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
    </div>
  );
};

export default StaffManagement;
