import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import ManagementTable from './ManagementTable';
import GenericModal from './GenericModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { classService, departmentService, programService } from '../../services/academicServices';
import { getApiMessage } from '../../utils/apiMessage';
import { motion } from 'framer-motion';
import { Sparkles, Layers } from 'lucide-react';

const ClassManagement = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const [classRes, deptRes, progRes] = await Promise.all([
        classService.getAll(),
        departmentService.getAll(),
        programService.getAll()
      ]);
      setData(classRes.data.data || classRes.data || []);
      setDepartments(deptRes.data.data || deptRes.data || []);
      setPrograms(progRes.data.data || progRes.data || []);
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
        const response = await classService.update(id, formData);
        toast.success(getApiMessage(response, 'Class updated successfully!'));
      } else {
        const response = await classService.create(formData);
        toast.success(getApiMessage(response, 'Class created successfully!'));
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      toast.error(getApiMessage(error, 'Error saving class'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await classService.delete(itemToDelete.id);
      setItemToDelete(null);
      fetchItems();
    } catch (error) {
      console.error(error);
      toast.error(getApiMessage(error, 'Error deleting class'));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Class Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center">
            <Layers size={14} />
          </div>
          <span className="text-[14px] font-semibold text-[#1d1d1f]">{row.name}</span>
        </div>
      )
    },
    {
      header: 'Year',
      accessor: 'year',
      render: (row) => (
        <span className="text-[13px] text-[#1d1d1f]/60">{row.year}</span>
      )
    },
    {
      header: 'Semester',
      accessor: 'semester',
      render: (row) => (
        <span className="inline-flex px-2.5 py-1 rounded-full bg-[#f5f5f7] text-[11px] font-semibold text-[#1d1d1f]/60">
          Semester {row.semester}
        </span>
      )
    },
    {
      header: 'Department',
      accessor: 'departmentId',
      render: (row) => (
        <span className="text-[13px] text-[#1d1d1f]/70">
          {departments.find(d => d.id === row.departmentId)?.name || row.departmentId || '—'}
        </span>
      )
    },
    {
      header: 'Program',
      accessor: 'courseId',
      render: (row) => (
        <span className="text-[13px] text-[#1d1d1f]/70">
          {programs.find(p => p.id === row.courseId)?.name || row.courseId || '—'}
        </span>
      )
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 space-y-8">
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
                <Layers size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-[#0066cc]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0066cc]">Academic Structure</span>
                </div>
                <h2 className="text-[28px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] text-white mb-1">
                  Class Management
                </h2>
                <p className="text-[15px] font-['SF Pro Text'] text-white/50">
                  Organize and manage academic classes, departments, and program assignments.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-full border border-white/10">
              <div className="text-center">
                <span className="block text-[32px] font-semibold font-['SF Pro Display'] text-white">{data.length}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">Total Classes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066cc]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#0066cc]/5 rounded-full blur-3xl"></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ManagementTable
          title="Class Directory"
          columns={columns}
          data={data}
          isLoading={isLoading}
          onAdd={() => { setSelectedItem(null); setIsModalOpen(true); }}
          onEdit={(item) => { setSelectedItem(item); setIsModalOpen(true); }}
          onDelete={(item) => setItemToDelete(item)}
          searchPlaceholder="Search classes by name, department or program..."
        />
      </motion.div>

      <GenericModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        isLoading={isSubmitting}
        initialData={selectedItem}
        title="Class"
        fields={[
          { name: 'name', label: 'Class Name', required: true, placeholder: 'e.g., CS-2024-A' },
          {
            name: 'departmentId',
            label: 'Department',
            type: 'select',
            required: true,
            options: departments.map(d => ({ value: d.id, label: d.name }))
          },
          {
            name: 'courseId',
            label: 'Program',
            type: 'select',
            required: true,
            options: programs.map(p => ({ value: p.id, label: p.name }))
          },
          { name: 'year', label: 'Year', type: 'number', required: true, placeholder: '2024' },
          { name: 'semester', label: 'Semester', type: 'number', required: true, placeholder: '1' }
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

export default ClassManagement;
