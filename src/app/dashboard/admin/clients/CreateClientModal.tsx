"use client";

import { useState, ChangeEvent } from "react";

interface CreateClientModalProps {
  onClose: () => void;
}

const CreateClientModal: React.FC<CreateClientModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    password: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    street: "",
    city: "",
    zipCode: "",
    country: "",
    role: "CLIENT",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createClient = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erreur lors de la création du client");

      window.location.reload(); // Recharge la page après création
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[90%] max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Ajouter un client</h2>

        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          placeholder="Prénom"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
          required
        />

        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          placeholder="Nom"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mot de passe"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
          required
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
          placeholder="Date de naissance (JJ-MM-AAAA)"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
          required
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
          <button onClick={createClient} className="bg-blue-500 px-4 py-2 rounded">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateClientModal;
