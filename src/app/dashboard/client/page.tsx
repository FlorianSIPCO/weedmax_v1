"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";
import GamingLoader from "@/app/components/Loader/Loader";
import { ShoppingBag, DollarSign, MapPin } from "lucide-react";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  orders: {id: string; total: number}[];
  addresses: {id: string }[];
}

export default function ClientDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupération des données de l'utilisateur
  useEffect(() => {
    if (session?.user?.id) {
      setLoading(true);
      fetch(`/api/users/${session.user.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Utilisateur non trouvé");
          return res.json();
        })
        .then((data) => {
          setUser(data);
        })
        .catch((error) => console.error("Erreur de récupération: ", error))
        .finally(() => setLoading(false));
    }
  }, [session]);

  const totalSpent = Number(user?.orders?.length ? user.orders.reduce((acc, order) => acc + order.total, 0) : 0);
  const orderCount = user?.orders?.length ?? 0;
  const addressCount = user?.addresses?.length ?? 0;

  return (
    <div className="text-white">
      {loading ? (
        <div className="flex justify-center"><GamingLoader/></div>
      ) : (
        <>
          <h1 className="flex flex-col items-center lg:items-start text-center lg:text-left text-3xl font-bold">Bienvenue {user?.firstname} 👋</h1>
          <p className="text-gray-400 mt-2">Voici un aperçu de ton compte.</p>

          {/* Section des statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            <StatCard 
              title="Commandes passées"
              value={orderCount}
              color="bg-gray-800 cursor-pointer border border-red-500 hover:bg-red-500 transition-all ease-in-out duration-300"
              icon={<ShoppingBag size={40} />}
              onClick={() => router.push("/dashboard/client/orders")}
            />
            <StatCard 
              title="Montant total dépensé"
              value={`${totalSpent.toFixed(2)} €`}
              color="bg-gray-800 cursor-pointer border border-red-500 hover:bg-red-500 transition-all ease-in-out duration-300"
              icon={<DollarSign size={40} />}
              onClick={() => router.push("/dashboard/client/orders")}
            />
            <StatCard 
              title="Adresses enregistrées"
              value={addressCount}
              color="bg-gray-800 cursor-pointer border border-red-500 hover:bg-red-500 transition-all ease-in-out duration-300"
              icon={<MapPin size={40} />}
              onClick={() => router.push("/dashboard/client/settings")}
            />
          </div>
        </>
      )}
    </div>
  );
}

// Composant pour afficher une carte statistique
const StatCard = ({ title, value, color, icon, onClick }: { title: string; value: string | number; color: string; icon: JSX.Element; onClick: () => void; }) => {
  return (
    <div className={`p-6 ${color} text-white rounded-lg shadow-lg flex flex-col items-center text-center`} onClick={onClick}>
      {icon}
      <h2 className="text-2xl font-semibold mt-2">{title}</h2>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
};