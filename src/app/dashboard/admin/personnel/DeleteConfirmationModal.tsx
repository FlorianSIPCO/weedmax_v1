"use client";

interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[90%] max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Confirmation</h2>
        <p className="mb-4">Êtes-vous sûr de vouloir supprimer cet Admin ? Cette action est irréversible.</p>

        <div className="flex justify-between">
          <button onClick={onCancel} className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600">
            Annuler
          </button>
          <button onClick={onConfirm} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
