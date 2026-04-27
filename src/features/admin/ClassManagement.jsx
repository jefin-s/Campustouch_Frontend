import { useState, useEffect, useCallback } from 'react';
import ManagementTable from './ManagementTable';
import GenericModal from './GenericModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { classService } from '../../services/academicServices';

const ClassManagement = () => {
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
      const response = await classService.getAll();
      setData(response.data.data || response.data || []);
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
        await classService.update(id, formData);
        alert('Class updated successfully!');
      } else {
        await classService.create(formData);
        alert('Class created successfully!');
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      alert(error.message || 'Error saving class');
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
      alert('Error deleting class');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ManagementTable 
        title="Class Management"
        columns={[
          { header: 'Class Name', accessor: 'name' },
          { header: 'Year', accessor: 'year' },
          { header: 'Semester', accessor: 'semester' },
          { header: 'Dept ID', accessor: 'departmentId' },
          { header: 'Course ID', accessor: 'courseId' }
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
        title="Class"
        fields={[
          { name: 'name', label: 'Class Name', required: true, placeholder: 'e.g. CS-2024-A' },
          { name: 'departmentId', label: 'Department ID', type: 'number', required: true },
          { name: 'courseId', label: 'Course ID', type: 'number', required: true },
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
    </>
  );
};

export default ClassManagement;
