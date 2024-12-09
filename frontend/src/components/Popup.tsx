import React from 'react';
import '../styles/Popup.css'; 

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const Popup: React.FC<PopupProps> = ({ isVisible, onClose, onConfirm, onCancel }) => {
  if (!isVisible) return null; // If not visible, don't render the popup

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Are you satisfied with your order?</h2>
        <div className="popup-actions">
          <button onClick={onConfirm} className="popup-confirm-button">Yes, Continue</button>
          <button onClick={onCancel} className="popup-cancel-button">No, Change Order</button>
        </div>
        <button onClick={onClose} className="popup-close-button">X</button>
      </div>
    </div>
  );
};

export default Popup;
