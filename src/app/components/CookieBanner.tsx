"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "false");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 w-full bg-gray-900 text-white p-4 z-100 flex flex-col items-center md:flex-row justify-between shadow-xl">
      <p className="text-sm lg:ml-10">
        Ce site utilise des cookies essentiels pour garantir le bon fonctionnement des services, comme la gestion de session ou du panier.
        <Link href="/politique-de-confidentialite" className="underline hover:text-gray-300 ml-2">
          En savoir plus
        </Link>
      </p>
      <div className="mt-6 md:mt-0">
        <button onClick={handleAccept} className="bg-green-500 px-4 py-2 rounded text-white mr-2">Accepter</button>
        <button onClick={handleReject} className="bg-red-500 px-4 py-2 rounded text-white">Refuser</button>
      </div>
    </div>
  );
}
