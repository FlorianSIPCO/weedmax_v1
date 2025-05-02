"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, JSX } from "react";
import GamingLoader from "@/app/components/Loader/Loader";
import { PackageOpen, CheckCircle, Clock, XCircle } from "lucide-react";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function ClientOrders() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      setLoading(true);
      fetch(`/api/users/${session.user.id}/orders`)
        .then((res) => {
          if (!res.ok) throw new Error("Erreur lors de la récupération des commandes");
          return res.json();
        })
        .then((data) => {
          setOrders(data);
        })
        .catch((error) => console.error("Erreur de récupération: ", error))
        .finally(() => setLoading(false));
    }
  }, [session]);

  const statusIcons: Record<string, JSX.Element> = {
    "En cours": <Clock className="text-yellow-400" size={20} />,
    "Expédiée": <PackageOpen className="text-blue-400" size={20} />,
    "Livrée": <CheckCircle className="text-green-400" size={20} />,
    "Annulée": <XCircle className="text-red-400" size={20} />,
  };

  return (
    <div className="p-6 text-white">
      <h1 className="flex flex-col items-center lg:items-start text-center lg:text-left text-3xl font-bold mb-6">Historique des commandes</h1>

      {loading ? (
        <div className="flex justify-center">
          <GamingLoader />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-400 text-center">Aucune commande passée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="border border-gray-700 p-3">#</th>
                <th className="border border-gray-700 p-3">Date</th>
                <th className="border border-gray-700 p-3">Montant</th>
                <th className="border border-gray-700 p-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id} className="text-center border border-gray-700 hover:bg-gray-900">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 font-bold">{Number(order.total.toFixed(2))} €</td>
                  <td className="p-3 flex justify-center items-center gap-2">
                    {statusIcons[order.status] || <Clock size={20} />}
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
