"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  variantId: string;
  optionName?: string | null;
  variantQuantity: number;
  promoPercentage?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, variantId: string, optionName?: string | null) => void;
  updateQuantity: (id: string, variantId: string, optionName: string | null, quantity: number) => void;
  total: number;
  totalQuantity: number;
  isCartOpen: boolean;
  setIsCartOpen: (state: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    try {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }       
    } catch (error) {
        console.error("Erreur lors du chargement du panier:", error);
        localStorage.removeItem('cart')
    }
  }, []);

  // Sauvegarde le panier à chaque modification
  useEffect(() => {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
        console.error("Erreur lros de la sauvegarde du panier : ", error);
    }
  }, [cart]);


  // Logique de gestion du panier
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) =>
        cartItem.id === item.id &&
        cartItem.variantId === item.variantId &&
        cartItem.optionName === item.optionName
    );

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id &&
          cartItem.variantId === item.variantId &&
          cartItem.optionName === item.optionName
        ? { ...cartItem, quantity: cartItem.quantity + 1 } 
        : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, variantId: string, optionName?: string | null) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.id === id &&
            item.variantId === variantId &&
            (item.optionName ?? null) === (optionName ?? null)
          )
      )
    );
  };
  

  const updateQuantity = (id: string, variantId: string, optionName: string | null, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id &&
        item.variantId === variantId &&
        (item.optionName ?? null) === optionName
          ? { ...item, quantity }
          : item
      )
    );
  };
  
  

  // Calcul le total avec la promo avant d'afficher dans le panier
  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((acc, item) => {
      const finalPrice = item.promoPercentage && item.promoPercentage > 0
        ? item.price - (item.price * item.promoPercentage) / 100
        : item.price;

        return acc + finalPrice * item.quantity;
    }, 0);
  }

  const total = useMemo(() => calculateTotal(cart), [cart]);

  // Gestion du badge dynamique sur le panier
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, total, isCartOpen, setIsCartOpen, totalQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
