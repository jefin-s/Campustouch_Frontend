import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card delete-modal">
        <div className="delete-modal-content">
          <div className="warning-icon">
            <AlertTriangle size={32} />
          </div>
          
          <div className="delete-text">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone and will permanently remove all associated data.</p>
          </div>

          <div className="delete-actions">
            <button 
              className="cancel-btn" 
              onClick={onClose} 
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              className="confirm-delete-btn" 
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Delete Permanently'}
            </button>
          </div>
        </div>
        <button className="absolute-close" onClick={onClose} disabled={isLoading}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
