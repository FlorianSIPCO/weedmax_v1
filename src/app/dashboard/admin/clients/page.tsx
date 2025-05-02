"use client";

import { useEffect, useState } from "react";
import ClientTable from "./ClientTable";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/users?role=CLIENT");
        if (!res.ok) throw new Error("Erreur lors de la récupération des clients");
        const data = await res.json();
        setClients(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="text-white">
      <h1 className="text-center lg:text-left text-2xl lg:text-3xl font-bold mb-6">Gestion des Clients</h1>
      <ClientTable clients={clients} />
    </div>
  );
};

export default ClientsPage;
