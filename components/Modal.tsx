
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md m-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold leading-6 text-slate-900">{title}</h3>
        <div className="mt-2">
          <p className="text-sm text-slate-600">{children}</p>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-transparent rounded-md hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
            onClick={onConfirm}
          >
            Yes, Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
