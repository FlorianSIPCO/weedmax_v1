"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SpinnerButtons from "@/app/components/SpinnerButtons/SpinnerButtons";

export default function ClientSettings() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  
  // Logique de modification
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
  });
  
  const [passwordData, setPasswordData] = useState({
    password: "",
    newPassword: "",
  });
  
  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/users/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          setUserData({
            firstname: data.firstname || "",
            lastname: data.lastname || "",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
          })
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des données utilisateur: ', error)
          toast.error('Impossible de charger vos informations');
        })
    }
  }, [session])

  // Mise à jour des informations utilisateur
  const handleUpdateProfile = async () => {
    setLoading(true);
  
    try {
      const res = await fetch("/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la mise à jour")

      toast.success("Profil mis à jour avec succès")
    } catch (error: unknown) {
      let errorMessage = "Erreur lors de la mise à jour du profil";

      if (error instanceof Error) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
    } finally {
      setLoading(false);
    }
  }

  // Changer le mot de passe
  const handleChangePassword = async () => {
    if (!passwordData.password || !passwordData.newPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoading(false);

    try {
      const res = await fetch('/api/users/update', {
        method: "PUT",
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify(passwordData),
      })

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors du changement de mot de passe")
      
      toast.success('Mot de passe mis à jour avec succès')
      setPasswordData({ password: "", newPassword: ""})
    } catch (error: unknown) {
      let errorMessage = "Erreur lors du changement de mot de passe";

      if (error instanceof Error) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    } finally {
      setLoading(false);
    }
  }

  // Logique de suppression
  const handleDeleteAccount = async () => {
    if (!password) {
      toast.error("Veuillez saisir votre mot de passe.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la suppression du compte");
      }

      toast.success("Compte supprimé avec succès");
      await signOut(); // Déconnexion automatique
      router.push("/"); // Redirection vers l'accueil
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        console.error("Erreur lors de la suppression du compte :", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Paramètres du compte</h1>

      {/* Section : Mise à jour des informations personnelles */}
      <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Modifier mes informations</h2>

        <label className="block text-gray-300 mb-2">Prénom</label>
        <input
          type="text"
          value={userData.firstname}
          onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <label className="block text-gray-300 mb-2">Nom</label>
        <input
          type="text"
          value={userData.lastname}
          onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <label className="block text-gray-300 mb-2">Téléphone</label>
        <input
          type="text"
          value={userData.phoneNumber}
          onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <label className="block text-gray-300 mb-2">Email</label>
        <input
          type="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
        >
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </div>

      {/* Section : Changer le mot de passe */}
      <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Changer mon mot de passe</h2>

        <label className="block text-gray-300 mb-2">Mot de passe actuel</label>
        <input
          type="password"
          value={passwordData.password}
          onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mb-4"
        />

        <label className="block text-gray-300 mb-2">Nouveau mot de passe</label>
        <input
          type="password"
          value={passwordData.newPassword}
          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mb-4"
        />

        <button onClick={handleChangePassword} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">
          Modifier le mot de passe
        </button>
      </div>

      {/* Section suppression de compte */}
      <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Supprimer mon compte</h2>
        <p className="text-gray-400 mb-4">
          Attention, cette action est irréversible. Votre compte et toutes vos données seront supprimés définitivement.
        </p>

        <label className="block text-gray-300 mb-2">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Entrez votre mot de passe"
        />

        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className="mt-4 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
        >
          {loading ? <SpinnerButtons/> : "Supprimer mon compte"}
        </button>
      </div>
    </div>
  );
}
