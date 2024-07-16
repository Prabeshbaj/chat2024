import React from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (labelName: string) => void;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, onCreate }) => {
  const [labelName, setLabelName] = React.useState('');

  const handleCreate = () => {
    onCreate(labelName);
    setLabelName('');
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>New Label</h2>
        <input 
          type="text" 
          value={labelName} 
          onChange={(e) => setLabelName(e.target.value)} 
          placeholder="Label Name" 
        />
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
