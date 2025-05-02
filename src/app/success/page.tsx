"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import SpinnerButtons from "@/app/components/SpinnerButtons/SpinnerButtons";
import toast from "react-hot-toast";
import GamingLoader from "../components/Loader/Loader";

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session_id) {
      toast.error("Aucune session trouvée.");
      router.push("/"); // Redirection vers la page d'accueil si pas de session
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`/api/order?session_id=${session_id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Erreur lors de la récupération de la commande.");
        }

        toast.success("Paiement validé ! Merci pour votre commande.");
      } catch (error) {
        if (error instanceof Error) {
            toast.error(error.message);
        } else {
            toast.error("Une erreur inconnue s'est produite.")
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [session_id, router]);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-white bg-[url('/images/bg.jpg')] bg-cover bg-center">
      <h1 className="text-3xl font-bold mb-4">Merci pour votre commande !</h1>
      <p className="text-lg text-gray-300">Votre paiement a été validé.</p>

      {loading ? (
        <SpinnerButtons />
      ) : (
        <button
          onClick={() => router.push("/dashboard/client")}
          className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:scale-105 transition"
        >
          Voir mes commandes
        </button>
      )}
    </div>
  );
};

export default function SuccessPage() {
  return (
    <Suspense fallback={<GamingLoader />}>
      <SuccessContent />
    </Suspense>
  )
};
