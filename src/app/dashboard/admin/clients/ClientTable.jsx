"use client";

import ClientRow from "./ClientRow";

const ClientTable = ({ clients }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg overflow-x-auto">
      <table className="w-full text-white">
        <thead>
          <tr className="border-b border-gray-600 text-left">
            <th className="p-3">Nom</th>
            <th className="p-3">Prénom</th>
            <th className="p-3">Email</th>
            <th className="p-3">Téléphone</th>
            <th className="p-3">Date de Naissance</th>
            <th className="p-3">Adresse</th>
            <th className="p-3">Commandes</th>
            <th className="p-3">Créé le</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <ClientRow key={client.id} client={client} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
