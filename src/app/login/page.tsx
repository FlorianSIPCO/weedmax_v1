"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import SpinnerButtons from "../components/SpinnerButtons/SpinnerButtons";

interface FormData {
  firstname?: string;
  lastname?: string;
  phoneNumber?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  street?: string;
  zipCode?: string;
  city?: string;
  country?: string;
}

const LoginPage = () => {
  const { register, handleSubmit, watch, reset } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
  const [DateFormat, setDateFormat] = useState('')
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  // Ecoute les valeurs du formulaire
  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");
  const dateOfBirth = watch("dateOfBirth", "");

  // Vérification des critères du mot de passe
  const passwordCriteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);

  // Etat pour gérer la visibilité des mots de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)
  

  // Ajoute directement le "-" dans l'input date
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "") // Supprime tout ce qui n'est pas un chiffre
    
    if (value.length > 2) {
      value = `${value.slice(0, 2)}-${value.slice(2)}`;
    }
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5, 9)}`;
    }
    setDateFormat(value);
  }

  // Logique de connexion
  const handleLogin = async (data: FormData) => {
    setLoading(true);
  
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password
      });
  
      if (res?.error) {
        toast.error("Échec de connexion");
        setLoading(false);
        return;
      }
  
      // Récupérer la session après connexion
      const session = await getSession();
      const redirectUrl = localStorage.getItem("redirectAfterLogin");
      localStorage.removeItem("redirectAfterLogin");
  
      if (redirectUrl === "stripe-checkout") {
        // Récupérer le panier stocké avant la connexion
        const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  
        if (cartItems.length > 0) {
          // Relancer la requête vers Stripe
          const checkoutRes = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartItems, userId: session?.user.id, userEmail: session?.user.email })
          });
  
          const checkoutData = await checkoutRes.json();
          if (checkoutData.url) {
            // NE PAS EXÉCUTER D'AUTRES REDIRECTIONS
            window.location.href = checkoutData.url; // Redirection vers Stripe
            return;
          } else {
            toast.error("Erreur lors de la redirection vers Stripe");
          }
        }
      }
  
      // Si on n'est pas dans un cas Stripe, on redirige vers le dashboard
      if (session?.user.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/client");
      }
    } catch (error) {
      let errorMessage = "Erreur lors de la connexion";

      if (error instanceof Error) {
        errorMessage = error.message;
      }
  
      console.error("Erreur lors de la connexion :", errorMessage);
      toast.error('Erreur lors de la connexion');
    } finally {
      setLoading(false);
      reset();
    }
  };
  

  // Logique d'inscription
  const handleRegister = async (data: FormData) => {
    setLoading(true);

    try {
      // Vérification du mot de passe et confirmation
      if (password !== confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas")
        return;
      }

      // Convertir la date de naissance en format YYYY-MM-DD
      const formattedDate = dateOfBirth ? dateOfBirth.split("-").reverse().join("-") : "";
  
      // Inscription
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, dateOfBirth: formattedDate }),
        });

        if (!res.ok) {
          throw new Error("Erreur lors de l'inscription");
        }

        toast.success("Inscription réussie ! Connectez-vous");
        setIsRegistering(false);
      } catch (error) {
        let errorMessage = "Une erreur est survenue";

        if (error instanceof Error) {
          errorMessage = error.message;
        }
    
        console.error("Une erreur est survenue :", errorMessage);
        toast.error("Une erreur est survenue");
      } finally {
      setLoading(false);
    };
  }

  const inputStyle = "w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:border-pink-400 focus:ring-2 focus:ring-pink-400 transition-all outline-none";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-light text-white">
      <motion.div
        className="bg-black bg-opacity-70 p-8 rounded-2xl shadow-lg border border-none w-full max-w-lg my-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-4xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-main">
          {isRegistering ? "Créer un compte" : "Connexion"}
        </h2>

        <form onSubmit={handleSubmit(isRegistering ? handleRegister : handleLogin)} className="space-y-4">
          {isRegistering && (
            <>
              <div className="flex gap-4">
                <input
                  type="text"
                  {...register("firstname")}
                  placeholder="Prénom"
                  className={inputStyle}
                  required
                />
                <input
                  type="text"
                  {...register("lastname")}
                  placeholder="Nom"
                  className={inputStyle}
                  required
                />
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  {...register("dateOfBirth")}
                  value={DateFormat}
                  onChange={handleDateChange}
                  placeholder="Date de naissance"
                  pattern="\d{2}-\d{2}-\d{4}"
                  className={inputStyle}
                  maxLength={10}
                  required
                />
                <input
                  type="text"
                  {...register("phoneNumber")}
                  placeholder="Téléphone"
                  className={inputStyle}
                  required
                />
              </div>
            </>
          )}

          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className={inputStyle}
            autoComplete="off"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Mot de passe"
              className={inputStyle}
              required
              autoComplete="new-password"
              onFocus={() => setShowPasswordCriteria(true)}
              onBlur={() => setShowPasswordCriteria(false)}
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-4 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {isRegistering && (
            <>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Confirmer mot de passe"
                className={inputStyle}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPassword}
                className="absolute right-3 top-4 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
              <input
                type="text"
                {...register("street")}
                placeholder="Adresse"
                className={inputStyle}
                required
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  {...register("zipCode")}
                  placeholder="Code postal"
                  className={inputStyle}
                  required
                />
                <input
                  type="text"
                  {...register("city")}
                  placeholder="Ville"
                  className={inputStyle}
                  required
                />
              </div>
              <input
                type="text"
                {...register("country")}
                placeholder="Pays"
                className={inputStyle}
                required
              />
              {/* Vérification des critères du mot de passe */}
              {showPasswordCriteria && (
                <ul className="text-sm text-gray-400 mt-2 space-y-1">
                  <li className={passwordCriteria.length ? "text-green-400" : "text-red-400"}>
                    {passwordCriteria.length ? "✔" : "✖"} 8 caractères minimum
                  </li>
                  <li className={passwordCriteria.uppercase ? "text-green-400" : "text-red-400"}>
                    {passwordCriteria.uppercase ? "✔" : "✖"} Une majuscule
                  </li>
                  <li className={passwordCriteria.lowercase ? "text-green-400" : "text-red-400"}>
                    {passwordCriteria.lowercase ? "✔" : "✖"} Une minuscule
                  </li>
                  <li className={passwordCriteria.number ? "text-green-400" : "text-red-400"}>
                    {passwordCriteria.number ? "✔" : "✖"} Un chiffre
                  </li>
                  <li className={passwordCriteria.special ? "text-green-400" : "text-red-400"}>
                    {passwordCriteria.special ? "✔" : "✖"} Un caractère spécial
                  </li>
                </ul>
              )}

              {/* Checkbox RGPD CGU */}
              <div className="flex items-start space-x-2 text-sm text-gray-300 mt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={hasAcceptedTerms}
                  onChange={() => setHasAcceptedTerms(!hasAcceptedTerms)}
                  className="mt-1"
                  required
                />
                <label htmlFor="terms">
                  J'ai lu et j'accepte les{" "}
                  <Link href="/cgu" className="text-pink-500 underline hover:text-pink-400">
                    conditions générales d'utilisation
                  </Link>
                </label>
              </div>
            </>
          )}

          <motion.button
            type="submit"
            disabled={loading || (isRegistering && (!allCriteriaMet || !hasAcceptedTerms))}
            className="w-full bg-gradient-main hover:scale-105 transition text-white font-bold py-3 rounded-xl shadow-lg"
            whileTap={{ scale: 0.95 }}
          >
            {loading ? <SpinnerButtons /> : isRegistering ? "S'inscrire" : "Se connecter"}
          </motion.button>
        </form>

        <div className="text-center mt-4">
          <button
            className="text-gray-400 hover:text-white transition"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Déjà inscrit ? Connectez-vous" : "Pas encore inscrit ? Créez un compte !"}
          </button>
        </div>

        {!isRegistering && (
          <div className="text-center mt-2">
            <Link href="/resetPassword" className="text-pink-500 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
