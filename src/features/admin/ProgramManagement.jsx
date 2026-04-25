import React, { useState, useEffect, useCallback } from 'react';
import ManagementTable from './ManagementTable';
import GenericModal from './GenericModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { programService } from '../../services/academicServices';

const ProgramManagement = () => {
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
      const response = await programService.getAll();
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
        await programService.update(id, formData);
        alert('Program updated successfully!');
      } else {
        await programService.create(formData);
        alert('Program created successfully!');
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      alert(error.message || 'Error saving program');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await programService.delete(itemToDelete.id);
      setItemToDelete(null);
      fetchItems();
    } catch (error) {
      alert('Error deleting program');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ManagementTable 
        title="Programs / Courses"
        columns={[
          { header: 'Name', accessor: 'name' },
          { header: 'Level', accessor: 'level' },
          { header: 'Duration (Years)', accessor: 'duration' },
          { header: 'Dept ID', accessor: 'departmentId' }
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
        title="Program"
        fields={[
          { name: 'name', label: 'Program Name', required: true, placeholder: 'e.g. B.Tech CS' },
          { name: 'level', label: 'Level', required: true, placeholder: 'e.g. Undergraduate' },
          { name: 'duration', label: 'Duration (Years)', type: 'number', required: true },
          { name: 'departmentId', label: 'Department ID', type: 'number', required: true }
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

export default ProgramManagement;
