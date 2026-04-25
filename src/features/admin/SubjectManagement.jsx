import React, { useState, useEffect, useCallback } from 'react';
import ManagementTable from './ManagementTable';
import GenericModal from './GenericModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { subjectService } from '../../services/academicServices';

const SubjectManagement = () => {
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
      const response = await subjectService.getAll();
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
        await subjectService.update(id, formData);
        alert('Subject updated successfully!');
      } else {
        await subjectService.create(formData);
        alert('Subject created successfully!');
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      alert(error.message || 'Error saving subject');
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
      alert('Error deleting subject');
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
          { header: 'Semester ID', accessor: 'semesterId' }
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
          { name: 'semesterId', label: 'Semester ID', type: 'number', required: true }
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
