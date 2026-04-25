import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

const GenericModal = ({ isOpen, onClose, onSubmit, isLoading, initialData, title, fields }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        const defaultData = {};
        fields.forEach(f => {
          defaultData[f.name] = f.type === 'number' ? 0 : '';
        });
        setFormData(defaultData);
      }
    }
  }, [isOpen, initialData, fields]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, formData.id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>{initialData ? `Update ${title}` : `Add New ${title}`}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
            {fields.map((field) => (
              <div className="form-group" key={field.name}>
                <label>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea 
                    name={field.name} 
                    value={formData[field.name] || ''} 
                    onChange={handleChange} 
                    required={field.required}
                    placeholder={field.placeholder}
                  />
                ) : field.type === 'select' ? (
                  <select 
                    name={field.name} 
                    value={formData[field.name] || ''} 
                    onChange={handleChange} 
                    required={field.required}
                  >
                    <option value="">Select an option</option>
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type={field.type || 'text'} 
                    name={field.name} 
                    value={formData[field.name] || ''} 
                    onChange={handleChange} 
                    required={field.required}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isLoading}>Cancel</button>
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (initialData ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenericModal;
