import  { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import ManagementTable from './ManagementTable';
import GenericModal from './GenericModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { departmentService } from '../../services/academicServices';
import { getApiMessage } from '../../utils/apiMessage';

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
    <>
      <ManagementTable 
        title="Departments"
        columns={[
          { header: 'Code', accessor: 'code' },
          { header: 'Name', accessor: 'name' },
          { header: 'Description', accessor: 'description' }
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
    </>
  );
};

export default DepartmentManagement;
