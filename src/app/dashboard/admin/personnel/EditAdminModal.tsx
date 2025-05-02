"use client";

import { ChangeEvent, useState } from "react";

interface Admin {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth: string;
    addresses: { street: string; city: string; zipCode: string; country: string }[];
  }
  
  interface EditAdminModalProps {
    admin: Admin;
    onClose: () => void;
  }

const EditAdminModal: React.FC<EditAdminModalProps> = ({ admin, onClose }) => {
  // Conversion de la date au format FR pour l'affichage
  const formatDateFR = (date: string) => {
    if(!date) return "";
    const [year, month, day] = date.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  }

  // Conversion de la date au format YYYY-DD-DD avant l'envoi
  const formatDateISO = (date: string) => {
    if (!date) return "";
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  }

  const [formData, setFormData] = useState({
    firstname: admin.firstname,
    lastname: admin.lastname,
    email: admin.email,
    phoneNumber: admin.phoneNumber || "",
    dateOfBirth: formatDateFR(admin.dateOfBirth),
    street: admin.addresses[0]?.street || "",
    city: admin.addresses[0]?.city || "",
    zipCode: admin.addresses[0]?.zipCode || "",
    country: admin.addresses[0]?.country || "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateAdmin = async () => {
    try {
      const updatedData = { ...formData, dateOfBirth: formatDateISO(formData.dateOfBirth) };

      const res = await fetch(`/api/users/${admin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[90%] max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Modifier l'admin</h2>

        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          placeholder="Prénom"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
        />

        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          placeholder="Nom"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
        />

        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Téléphone"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
        />
        <input
          type="text"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          placeholder="Date de naissance"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
        />
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="Rue"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
        />
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          placeholder="Code postal"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Ville"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Pays"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
        />

        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="bg-red-500 px-4 py-2 rounded">
            Annuler
          </button>
          <button onClick={updateAdmin} className="bg-blue-500 px-4 py-2 rounded">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAdminModal;
