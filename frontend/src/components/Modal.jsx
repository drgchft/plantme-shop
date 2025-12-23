import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/components.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-content">
          {children}
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
