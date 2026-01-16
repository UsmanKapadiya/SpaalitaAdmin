import React from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import Button from '../../components/Button/Button';
import './ConfirmDialog.css';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger' // 'danger', 'warning', 'info'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      <div className="confirm-overlay" onClick={onClose} />
      <div className="confirm-dialog">
        <Button className="confirm-close" type="button" onClick={onClose}>
          <CloseIcon />
        </Button>
        
        <div className={`confirm-icon ${type}`}>
          <WarningAmberIcon style={{ fontSize: 48 }} />
        </div>
        
        <h2 className="confirm-title">{title}</h2>
        <p className="confirm-message">{message}</p>
        
        <div className="confirm-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button 
            className="btn-secondary" 
            type="button"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button 
            className={`btn-add ${type}`}
            type="button"
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
