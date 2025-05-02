"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import { CiMenuFries } from "react-icons/ci";
import { useCart } from "@/context/CartContext";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsCartOpen, totalQuantity } = useCart();
  const [navBg, setNavBg] = useState("bg-black");
  const [categories, setCategories] = useState<Category[]>([]);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setNavBg(window.scrollY > 50 ? "bg-black shadow-lg" : "bg-black");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <nav className={`shadow-md sticky top-0 w-full z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-28">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/images/logo_weedmax.jpg"
              alt="Logo Weedmax"
              width={100}
              height={50}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex flex-grow justify-center">
          <ul className="flex space-x-8 text-lg">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/products/${cat.slug}`}
                  className="text-gray-300 transition-all relative duration-300 hover:scale-105 hover:text-secondary font-bold tracking-widest"
                >
                  {cat.name}
                  <span className="absolute left-0 -bottom-1 h-1 w-full bg-secondary scale-x-0 transition-transform duration-300 hover:scale-x-100"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => setIsCartOpen(true)}
            className="hidden lg:flex relative text-green-500 hover:text-green-400 transition"
          >
            <FaShoppingCart size={26} />
            {totalQuantity > 0 && (
              <span className="absolute top-[-10px] left-4 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalQuantity}
              </span>
            )}
          </button>
          <Link href="/login" className="text-gray-300 font-bold hover:text-secondary transition">Se connecter</Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex flex-items space-x-8">
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex relative text-green-500 hover:text-green-400 transition"
        >
          <FaShoppingCart size={26} />
          {totalQuantity > 0 && (
            <span className="absolute top-[-10px] left-4 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalQuantity}
            </span>
          )}
        </button>
          <button className="text-3xl text-gray-300" onClick={toggleMenu}>
            {isOpen ? <FiX /> : <CiMenuFries />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-black bg-opacity-95 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <button className="absolute top-8 right-8 text-3xl text-white" onClick={toggleMenu}>
          <FiX />
        </button>
        <div className="mt-24 flex justify-center space-x-6 text-xl">
          <Link href="/login" className="text-pink-500 hover:text-pink-400 transition">
            Se connecter
          </Link>
        </div>
        <ul className="mt-12 space-y-6 text-center text-xl">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/products/${cat.slug}`}
                className="text-white hover:text-green-500 transition"
                onClick={toggleMenu}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
