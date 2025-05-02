"use client";

import { useState } from "react";
import EditClientModal from "./EditClientModal";
import { Trash2, Edit } from "lucide-react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ReactDOM from 'react-dom'

interface Client {
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

interface ClientRowProps {
  client: Client;
}

const ClientRow: React.FC<ClientRowProps> = ({ client }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Formater les dates en `DD-MM-YYYY`
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  // Construire l'adresse complète
  const formatAddress = (addresses: Client["addresses"]) => {
    if (!addresses.length) return "Aucune adresse";
    return addresses.map((addr) => `${addr.street}, ${addr.zipCode} ${addr.city}, ${addr.country}`).join(" | ");
  };

  // Nombre de commandes
  const orderCount = client.orders.length;

  // Fonction de suppression
  const deleteClient = async () => {
      try {
        await fetch(`/api/user/${client.id}`, { method: "DELETE" });
        window.location.reload();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }

  return (
    <>
      <tr className="border-b border-gray-600">
        <td className="p-3">{client.lastname}</td>
        <td className="p-3">{client.firstname}</td>
        <td className="p-3">{client.email}</td>
        <td className="p-3">{client.phoneNumber || "N/A"}</td>
        <td className="p-3">{formatDate(client.dateOfBirth)}</td>
        <td className="p-3">{formatAddress(client.addresses)}</td>
        <td className="p-3 text-center">{orderCount}</td>
        <td className="p-3">{formatDate(client.createdAt)}</td>
        <td className="p-3 flex gap-2">
          <button onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-600">
            <Edit size={18} />
          </button>
          <button onClick={() => setIsDeleting(true)} className="text-red-400 hover:text-red-600">
            <Trash2 size={18} />
          </button>
        </td>
      </tr>

      {isEditing && ReactDOM.createPortal(<EditClientModal client={client} onClose={() => setIsEditing(false)} />, document.body)}
      {isDeleting && ReactDOM.createPortal(<DeleteConfirmationModal onConfirm={deleteClient} onCancel={() => setIsDeleting(false)} />, document.body)}
    </>
  );
};

export default ClientRow;
