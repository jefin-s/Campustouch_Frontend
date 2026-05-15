import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import ManagementTable from './ManagementTable';
import GenericModal from './GenericModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { subjectService, semesterService } from '../../services/academicServices';
import { getApiMessage } from '../../utils/apiMessage';

const SubjectManagement = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [semesters, setSemesters] = useState([]);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const [subRes, semRes] = await Promise.all([
        subjectService.getAll(),
        semesterService.getAll()
      ]);
      setData(subRes.data.data || subRes.data || []);
      setSemesters(semRes.data.data || semRes.data || []);
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
        const response = await subjectService.update(id, formData);
        toast.success(getApiMessage(response, 'Subject updated successfully!'));
      } else {
        const response = await subjectService.create(formData);
        toast.success(getApiMessage(response, 'Subject created successfully!'));
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      toast.error(getApiMessage(error, 'Error saving subject'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await subjectService.delete(itemToDelete.id);
      setItemToDelete(null);
      fetchItems();
    } catch (error) {
      console.error(error);
      toast.error(getApiMessage(error, 'Error deleting subject'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ManagementTable 
        title="Subject Management"
        columns={[
          { header: 'Code', accessor: 'code' },
          { header: 'Subject Name', accessor: 'name' },
          { header: 'Credits', accessor: 'credits' },
          { 
            header: 'Semester', 
            accessor: 'semesterId',
            render: (row) => semesters.find(s => s.id === row.semesterId)?.name || row.semesterId || 'N/A'
          }
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
        title="Subject"
        fields={[
          { name: 'name', label: 'Subject Name', required: true, placeholder: 'e.g. Data Structures' },
          { name: 'code', label: 'Subject Code', required: true, placeholder: 'e.g. CS201' },
          { name: 'credits', label: 'Credits', type: 'number', required: true },
          { 
            name: 'semesterId', 
            label: 'Semester', 
            type: 'select', 
            required: true,
            options: semesters.map(s => ({ 
              value: s.id, 
              label: s.name || `Semester ${s.number}` 
            }))
          }
        ]}
      />

      <DeleteConfirmModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        itemName={itemToDelete?.name}
        isLoading={isDeleting}
      />
    </>
  );
};

export default SubjectManagement;
