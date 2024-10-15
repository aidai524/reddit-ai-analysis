import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full ${className || ''}`}>
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
