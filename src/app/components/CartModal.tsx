"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Plus, Minus, Trash } from "lucide-react";
import { useState } from "react";
import SpinnerButtons from "./SpinnerButtons/SpinnerButtons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CartModal = () => {
  const { cart, removeFromCart, updateQuantity, total, isCartOpen, setIsCartOpen } = useCart();
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Fonction pour gérer le paiement
  const handleCheckout = async () => {    
    setLoadingCheckout(true);

    if (!session?.user?.id) {
      // Stocker l'URL de redirection après connexion
      localStorage.setItem("redirectAfterLogin", "stripe-checkout");
      localStorage.setItem('cartItems', JSON.stringify(cart))
      toast.error('Vous devez être connecté pour finaliser votre commande')
      setIsCartOpen(false);
      router.push("/login");
      setLoadingCheckout(false);
      return
    }

    try {
      const res = await fetch('/api/checkout', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cart, userId: session.user.id, userEmail: session.user.email }),
      });

      const data = await res.json();
      if (data.url) {
        setIsCartOpen(false);
        window.location.href = data.url; // Redirige vers Stripe
      } else {
        console.error("Erreur lors de la récupération de l'URL de paiement :", data.error);
      }
    } catch (error) {
      console.error('Erreur lors du paiement :', error);
    } finally {
      setLoadingCheckout(false);
    }
  }

  if (!isCartOpen) return null;
  
  return (
    <AnimatePresence>
      {isCartOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setIsCartOpen(false)} // Ferme la modal en cliquant en dehors
        >
          {/* Overlay flouté */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-xs z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal centrée */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div
              className="bg-gray-900 text-white p-6 rounded-lg w-[90%] max-w-3xl shadow-xl relative "
              onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant sur la modal
            >
              {/* Bouton Fermer */}
              <button className="absolute top-4 right-4 text-white" onClick={() => setIsCartOpen(false)}>
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-center mb-4">Votre Panier</h2>

              {cart.length === 0 ? (
                <p className="text-center text-gray-400">Votre panier est vide.</p>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.variantId}-${item.optionName ?? "no-option"}`} className="flex items-center gap-4 bg-gray-800 p-3 rounded-lg">
                      {/* Image */}
                      <div className="w-16 h-16 md:w-30 md:h-30 relative">
                        <Image src={item.image} alt={item.name} fill className="object-contain rounded-md" />
                      </div>


                      {/* Infos du produit */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                    
                        {item.optionName && (
                          <p className="text-sm text-gray-400">Option : {item.optionName}</p>
                        )}

                        <p className="test-sm text-gray-400">
                          Variante : {item.variantQuantity} {item.name.toLocaleLowerCase().includes('huile') ? "ml" : "g"}
                        </p>

                        {/* Prix dynamique */}
                        {item.promoPercentage && item.promoPercentage > 0 ? (
                          <div className="text-red-400 font-bold">
                            <span className="line-through text-gray-400 mr-1">
                              {item.price.toFixed(2)}€
                            </span>
                            <span>
                              {(item.price - (item.price * item.promoPercentage) / 100).toFixed(2)}€
                            </span>
                          </div>
                        ) : (
                          <p className="text-red-400 font-bold">{item.price.toFixed(2)}€</p>
                        )}
                        
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateQuantity(item.id, item.variantId, item.optionName ?? null, item.quantity - 1)} disabled={item.quantity <= 1}>
                            <Minus size={18} className="text-gray-400 hover:text-white transition" />
                          </button>
                          <span className="font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.variantId, item.optionName ?? null, item.quantity + 1)}>
                            <Plus size={18} className="text-gray-400 hover:text-white transition" />
                          </button>
                        </div>
                      </div>

                      {/* Supprimer */}
                      <button onClick={() => removeFromCart( item.id, item.variantId, item.optionName )} className="text-red-500 hover:text-red-700 transition">
                        <Trash size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              {cart.length > 0 && (
                <div className="mt-6 text-center">
                  <p className="text-lg font-bold">Total : <span className="text-red-500">{total.toFixed(2)}€</span></p>
                  <button 
                    onClick={handleCheckout}
                    disabled={loadingCheckout}
                    className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:scale-105 transition"
                  >
                    {loadingCheckout ? <SpinnerButtons /> : "Passer la commande"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
