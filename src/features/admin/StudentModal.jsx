import React, { useState, useEffect } from 'react';
import { X, Upload, Camera, Loader2 } from 'lucide-react';

const StudentModal = ({ isOpen, onClose, onSubmit, isLoading, initialData }) => {
  const defaultState = {
    CourseId: '',
    DepartmentId: '',
    AdmissionDate: new Date().toISOString().split('T')[0],
    FirstName: '',
    LastName: '',
    DateOfBirth: '',
    Gender: 'Male',
    PhoneNumber: '',
    Email: '',
    Address: '',
    GuardianName: '',
    GuardianPhone: '',
    BloodGroup: '',
    AdmissionNumber: '',
  };

  const [formData, setFormData] = useState(defaultState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Map initial data to form fields
        setFormData({
          CourseId: initialData.courseId || '',
          DepartmentId: initialData.departmentId || '',
          AdmissionDate: initialData.admissionDate ? initialData.admissionDate.split('T')[0] : '',
          FirstName: initialData.firstName || '',
          LastName: initialData.lastName || '',
          DateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
          Gender: initialData.gender || 'Male',
          PhoneNumber: initialData.phoneNumber || '',
          Email: initialData.email || '',
          Address: initialData.address || '',
          GuardianName: initialData.guardianName || '',
          GuardianPhone: initialData.guardianPhone || '',
          BloodGroup: initialData.bloodGroup || '',
          AdmissionNumber: initialData.admissionNumber || '',
          id: initialData.id
        });
        setImagePreview(initialData.profileImagePath || null);
      } else {
        setFormData(defaultState);
        setImagePreview(null);
        setImageFile(null);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Append all text fields
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });
    
    // Append image if exists
    if (imageFile) {
      data.append('ProfileImage', imageFile);
    }

    onSubmit(data, formData.id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card student-modal">
        <div className="modal-header">
          <h2>{initialData ? 'Update Student' : 'Add New Student'}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-content">
            {/* Image Upload Section */}
            <div className="image-upload-section">
              <div className="image-preview-container">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="image-placeholder">
                    <Camera size={32} />
                  </div>
                )}
                <label className="upload-badge">
                  <Upload size={14} />
                  <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                </label>
              </div>
              <p className="upload-hint">Upload Profile Photo</p>
            </div>

            <div className="form-grid">
              {initialData && (
                <div className="form-group">
                  <label>Admission Number</label>
                  <input type="text" name="AdmissionNumber" value={formData.AdmissionNumber} onChange={handleChange} required />
                </div>
              )}
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="FirstName" value={formData.FirstName} onChange={handleChange} required placeholder="Enter first name" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="LastName" value={formData.LastName} onChange={handleChange} required placeholder="Enter last name" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="Email" value={formData.Email} onChange={handleChange} required placeholder="example@gmail.com" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} required placeholder="Enter phone number" />
              </div>
              <div className="form-group">
                <label>Course ID</label>
                <input type="number" name="CourseId" value={formData.CourseId} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Department ID</label>
                <input type="number" name="DepartmentId" value={formData.DepartmentId} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Admission Date</label>
                <input type="date" name="AdmissionDate" value={formData.AdmissionDate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" name="DateOfBirth" value={formData.DateOfBirth} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="Gender" value={formData.Gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <input type="text" name="BloodGroup" value={formData.BloodGroup} onChange={handleChange} placeholder="e.g. A+" />
              </div>
              <div className="form-group full-width">
                <label>Home Address</label>
                <textarea name="Address" value={formData.Address} onChange={handleChange} placeholder="Enter full residential address" rows="2" />
              </div>
              <div className="form-group">
                <label>Guardian Name</label>
                <input type="text" name="GuardianName" value={formData.GuardianName} onChange={handleChange} required placeholder="Full name of guardian" />
              </div>
              <div className="form-group">
                <label>Guardian Phone</label>
                <input type="text" name="GuardianPhone" value={formData.GuardianPhone} onChange={handleChange} required placeholder="Contact number" />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isLoading}>Cancel</button>
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (initialData ? 'Update Student' : 'Save Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
