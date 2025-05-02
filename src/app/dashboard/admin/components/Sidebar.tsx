"use client";

import Link from "next/link";
import { LogOut, Home, Users, User, Package, Menu, X, Tags, Flower } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion'

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const navItems = [
    { name: "Accueil", href: "/dashboard/admin", icon: <Home size={20} /> },
    { name: "Clients", href: "/dashboard/admin/clients", icon: <Users size={20} /> },
    { name: "Personnel", href: "/dashboard/admin/personnel", icon: <User size={20} /> },
    { name: "Produits", href: "/dashboard/admin/products", icon: <Package size={20} /> },
    { name: "Catégories", href: "/dashboard/admin/categories", icon: <Tags size={20} /> },
    { name: "Options", href: "/dashboard/admin/options", icon: <Flower size={20} /> },
  ];

  return (
    <>
      <aside className="hidden lg:flex w-64 bg-gray-800 p-6 flex-col justify-between">
        <nav>
          <h2 className="text-2xl font-bold text-white mb-6">Admin</h2>
          <ul className="space-y-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition ${
                    pathname === item.href ? "bg-red-500" : "hover:bg-gray-700"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bouton Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 text-red-400 hover:text-white transition p-3 rounded-lg"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </aside>

      {/* Bouton pour ouvrir le menu en mobile/tablette */}
      <button onClick={() => setIsOpen(true)} className="lg:hidden p-3 text-white fixed top-4 left-4 z-50">
        <Menu size={28} />
      </button>

      {/* Overlay en mobile/tablette */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Version Mobile/Tablette (Animée) */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="fixed top-0 left-0 h-full w-64 bg-gray-800 p-6 flex flex-col justify-between z-50 lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Bouton pour fermer en mobile */}
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-white">
              <X size={28} />
            </button>

            {/* Navigation */}
            <nav>
              <h2 className="text-2xl font-bold text-white mb-6">Admin</h2>
              <ul className="space-y-4">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 p-3 rounded-lg transition ${
                        pathname === item.href ? "bg-red-500" : "hover:bg-gray-700"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Bouton Déconnexion */}
            <button
              onClick={logout}
              className="flex items-center gap-3 text-red-400 hover:text-white transition p-3 rounded-lg"
            >
              <LogOut size={20} />
              Déconnexion
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
