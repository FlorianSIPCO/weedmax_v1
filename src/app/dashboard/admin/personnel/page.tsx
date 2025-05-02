"use client";

import { useEffect, useState } from "react";
import AdminTable from "./AdminTable";

const AdminPage = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/users?role=ADMIN");
        if (!res.ok) throw new Error("Erreur lors de la récupération des admins");
        const data = await res.json();
        setAdmins(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="text-white">
      <h1 className="text-center lg:text-left text-2xl lg:text-3xl font-bold mb-6">Gestion du personnel</h1>
      <AdminTable admins={admins} />
    </div>
  );
};

export default AdminPage;
