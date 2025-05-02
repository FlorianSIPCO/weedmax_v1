"use client";

import { useState } from "react";
import EditAdminModal from "./EditAdminModal";
import { Trash2, Edit } from "lucide-react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ReactDOM from 'react-dom'

interface Admin {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth: string;
  addresses: { street: string; city: string; zipCode: string; country: string }[];
  orders: { id: string }[];
  createdAt: string;
}

interface AdminRowProps {
  admin: Admin;
}

const AdminRow: React.FC<AdminRowProps> = ({ admin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Formater les dates en `DD-MM-YYYY`
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  // Construire l'adresse complète
  const formatAddress = (addresses: Admin["addresses"]) => {
    if (!addresses.length) return "Aucune adresse";
    return addresses.map((addr) => `${addr.street}, ${addr.zipCode} ${addr.city}, ${addr.country}`).join(" | ");
  };

  // Nombre de commandes
  const orderCount = admin.orders.length;

  // Fonction de suppression
  const deleteAdmin = async () => {
      try {
        await fetch(`/api/user/${admin.id}`, { method: "DELETE" });
        window.location.reload();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }

  return (
    <>
      <tr className="border-b border-gray-600">
        <td className="p-3">{admin.lastname}</td>
        <td className="p-3">{admin.firstname}</td>
        <td className="p-3">{admin.email}</td>
        <td className="p-3">{admin.phoneNumber || "N/A"}</td>
        <td className="p-3">{formatDate(admin.dateOfBirth)}</td>
        <td className="p-3">{formatAddress(admin.addresses)}</td>
        <td className="p-3 text-center">{orderCount}</td>
        <td className="p-3">{formatDate(admin.createdAt)}</td>
        <td className="p-3 flex gap-2">
          <button onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-600">
            <Edit size={18} />
          </button>
          <button onClick={() => setIsDeleting(true)} className="text-red-400 hover:text-red-600">
            <Trash2 size={18} />
          </button>
        </td>
      </tr>
      {isEditing &&  ReactDOM.createPortal(<EditAdminModal admin={admin} onClose={() => setIsEditing(false)} />, document.body)}
      {isDeleting && ReactDOM.createPortal(<DeleteConfirmationModal onConfirm={deleteAdmin} onCancel={() => setIsDeleting(false)} />, document.body)}
    </>
  );
};

export default AdminRow;
