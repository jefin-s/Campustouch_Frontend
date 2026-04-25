import React, { useState, useEffect } from 'react';
import { X, Loader2, UserCheck } from 'lucide-react';

const StaffModal = ({ isOpen, onClose, onSubmit, isLoading, initialData }) => {
  const defaultState = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    departmentId: '',
    designation: '',
  };

  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          firstName: initialData.firstName || '',
          lastName: initialData.lastName || '',
          email: initialData.email || '',
          phoneNumber: initialData.phoneNumber || '',
          departmentId: initialData.departmentId || '',
          designation: initialData.designation || '',
          id: initialData.id
        });
      } else {
        setFormData(defaultState);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, formData.id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card student-modal">
        <div className="modal-header">
          <h2>{initialData ? 'Update Staff' : 'Add New Staff'}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-content">
            <div className="image-upload-section">
              <div className="image-preview-container">
                <div className="image-placeholder">
                  <UserCheck size={32} />
                </div>
              </div>
              <p className="upload-hint">Staff Information</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Enter first name" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Enter last name" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="staff@campus.com" disabled={!!initialData} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="Enter phone number" />
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input type="text" name="designation" value={formData.designation} onChange={handleChange} required placeholder="e.g. Professor, Lecturer" />
              </div>
              <div className="form-group">
                <label>Department ID</label>
                <input type="number" name="departmentId" value={formData.departmentId} onChange={handleChange} required placeholder="Enter dept ID" />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isLoading}>Cancel</button>
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (initialData ? 'Update Staff' : 'Save Staff')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffModal;
