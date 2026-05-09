import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import ManagementTable from './ManagementTable';
import GenericModal from './GenericModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { semesterService } from '../../services/academicServices';
import { getApiMessage } from '../../utils/apiMessage';

const SemesterManagement = () => {
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
      const response = await semesterService.getAll();
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
        const response = await semesterService.update(id, formData);
        toast.success(getApiMessage(response, 'Semester updated successfully!'));
      } else {
        const response = await semesterService.create(formData);
        toast.success(getApiMessage(response, 'Semester created successfully!'));
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      toast.error(getApiMessage(error, 'Error saving semester'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await semesterService.delete(itemToDelete.id);
      setItemToDelete(null);
      fetchItems();
    } catch (error) {
      console.error(error);
      toast.error(getApiMessage(error, 'Error deleting semester'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ManagementTable 
        title="Semesters"
        columns={[
          { header: 'Name', accessor: 'name' },
          { header: 'Order', accessor: 'orderNumber' },
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
        title="Semester"
        fields={[
          { name: 'name', label: 'Semester Name', required: true, placeholder: 'e.g. Semester 1' },
          { name: 'orderNumber', label: 'Order Number', type: 'number', required: true },
          { name: 'courseId', label: 'Course ID', type: 'number', required: true }
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

export default SemesterManagement;
