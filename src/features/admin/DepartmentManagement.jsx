import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import ManagementTable from './ManagementTable';
import GenericModal from './GenericModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { departmentService } from '../../services/academicServices';
import { getApiMessage } from '../../utils/apiMessage';
import { motion } from 'framer-motion';
import { Building2, Plus, ArrowRight, Sparkles } from 'lucide-react';

const DepartmentManagement = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await departmentService.getAll();
      const resolvedData = response.data?.items || response.data?.data || response.data || [];
      setData(Array.isArray(resolvedData) ? resolvedData : []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleModalSubmit = async (formData, id) => {
    setIsSubmitting(true);
    try {
      if (id) {
        const response = await departmentService.update(id, formData);
        toast.success(getApiMessage(response, 'Department updated successfully!'));
      } else {
        const response = await departmentService.create(formData);
        toast.success(getApiMessage(response, 'Department created successfully!'));
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      toast.error(getApiMessage(error, 'Error saving department'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await departmentService.delete(itemToDelete.id);
      setItemToDelete(null);
      fetchItems();
    } catch (error) {
      console.error(error);
      toast.error(getApiMessage(error, 'Error deleting department'));
    } finally {
      setIsDeleting(false);
    }
  };

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
                <Building2 size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-[#0066cc]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0066cc]">Academic Structure</span>
                </div>
                <h2 className="text-[28px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] text-white mb-1">
                  Departments
                </h2>
                <p className="text-[15px] font-['SF Pro Text'] text-white/50 max-w-md">
                  Organize institutional architecture and manage academic divisions.
                </p>
              </div>
            </div>

            <button
              onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-[#0066cc] hover:bg-[#0071e3] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all shadow-[rgba(0,102,204,0.3)_0_4px_12px] group"
            >
              <Plus size={16} />
              New Department
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066cc]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#0066cc]/5 rounded-full blur-3xl"></div>
      </motion.div>

      <ManagementTable
        title="Institutional Divisions"
        columns={[
          { header: 'Code', accessor: 'code', render: (row) => <span className="font-mono text-[12px] font-semibold text-[#0066cc] bg-[#0066cc]/10 px-2.5 py-1 rounded-full">{row.code || row.Code || '—'}</span> },
          { header: 'Name', accessor: 'name', render: (row) => <span className="text-[15px] font-semibold text-[#1d1d1f]">{row.name || row.Name || 'Unnamed'}</span> },
          { header: 'Description', accessor: 'description', render: (row) => <span className="text-[13px] text-[#1d1d1f]/40 max-w-xs block truncate">{row.description || row.Description || 'No description'}</span> }
        ]}
        data={data}
        isLoading={isLoading}
        onAdd={() => { setSelectedItem(null); setIsModalOpen(true); }}
        onEdit={(item) => { setSelectedItem(item); setIsModalOpen(true); }}
        onDelete={(item) => setItemToDelete(item)}
      />

      <GenericModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        isLoading={isSubmitting}
        initialData={selectedItem}
        title="Department"
        fields={[
          { name: 'name', label: 'Department Name', required: true, placeholder: 'e.g. Computer Science' },
          { name: 'code', label: 'Department Code', required: true, placeholder: 'e.g. CS' },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Briefly describe the department' }
        ]}
      />

      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        itemName={itemToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DepartmentManagement;
