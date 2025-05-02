"use client";

import GamingLoader from "@/app/components/Loader/Loader";
import { useSession } from "next-auth/react";
import { JSX, useEffect, useState } from "react";
import { Users, User, Package } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

interface Stats {
  clientCount: number;
  productCount: number;
  adminCount: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

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

  // Récupération des stats globales
  useEffect(() => {
    setLoadingStats(true);
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Erreur lors de la récupération des stats: ", error))
      .finally(() => setLoadingStats(false))
  }, [])

  return (
    <div className="text-white p-6">
      {loading ? (
        <div className="flex justify-center">
          <GamingLoader />
        </div>
      ) : (
        <>
          <h1 className="flex flex-col items-center lg:items-start text-center lg:text-left text-2xl lg:text-3xl font-bold">Bienvenue {user?.firstname} 👋</h1>
          <p className="text-gray-400 mt-2 text-center lg:text-left">Vous êtes connecté en tant qu'administrateur.</p>

          {/* Chargement des stats */}
          {loadingStats ? (
            <div className="flex justify-center mt-10">
              <GamingLoader />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 text-center">
              <StatCard 
                title="Clients" 
                value={stats?.clientCount ?? 0} 
                color="bg-gray-800 cursor-pointer border border-red-500 hover:bg-red-500 transition-all ease-in-out duration-300" 
                icon={<Users size={40} />} 
                onClick={() => router.push("/dashboard/admin/clients")}
              />
              <StatCard 
                title="Produits" 
                value={stats?.productCount ?? 0} 
                color="bg-gray-800 cursor-pointer border border-red-500 hover:bg-red-500 transition-all ease-in-out duration-300" 
                icon={<Package size={40} />} 
                onClick={() => router.push("/dashboard/admin/products")}
              />
              <StatCard 
                title="Personnel" 
                value={stats?.adminCount ?? 0} 
                color="bg-gray-800 cursor-pointer border border-red-500 hover:bg-red-500 transition-all ease-in-out duration-300" 
                icon={<User size={40} />} 
                onClick={() => router.push("/dashboard/admin/personnel")}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

  // Composant pour afficher une carte statistique
  const StatCard = ({ title, value, color, icon, onClick }: { title: string; value: number; color: string; icon: JSX.Element; onClick: () => void; }) => {
  return (
    <div className={`p-6 ${color} text-white rounded-lg shadow-lg flex flex-col items-center`} onClick={onClick}>
      {icon}
      <h2 className="text-2xl font-semibold mt-2">{title}</h2>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}
