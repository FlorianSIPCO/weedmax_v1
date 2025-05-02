"use client";

import SpinnerButtons from "@/app/components/SpinnerButtons/SpinnerButtons";

interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ onConfirm, onCancel, isLoading }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[90%] max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Confirmation</h2>
        <p className="mb-4">Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.</p>

        <div className="flex justify-between">
          <button onClick={onCancel} className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600">
            Annuler
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading} 
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            {isLoading ? <SpinnerButtons /> : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
