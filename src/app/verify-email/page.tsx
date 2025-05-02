"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import GamingLoader from "../components/Loader/Loader";

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage("Token invalide");
      setLoading(false);
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage("Échec de la validation de l'email.");
        } else {
          setMessage("Votre email a été vérifié avec succès !");
          toast.success("Votre email a été vérifié !");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      })
      .catch(() => {
        setMessage("Erreur lors de la vérification de l'email.");
      })
      .finally(() => setLoading(false));
  }, [searchParams, router]);

  return (
    <div className="h-screen flex items-center justify-center text-white">
      {loading ? <GamingLoader/> : <p>{message}</p>}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<GamingLoader />}>
      <VerifyEmailContent />
    </Suspense>
  )
}