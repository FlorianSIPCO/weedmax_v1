"use client";

import { useEffect, useState } from "react";
import { ProductWithOptions } from "@/types";
import ProductCard from "@/app/components/ProductCard";
import LoaderDark from "@/app/components/Loader/LoaderDark";
import Link from "next/link";

const NewProductsPage = () => {
  const [products, setProducts] = useState<ProductWithOptions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const res = await fetch("/api/products/nouveautes");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Erreur lors du chargement des nouveautés :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  return (
    <div className="bg-gradient-light min-h-screen pb-12">
      <div className="p-6 text-white max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Nouveautés</h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoaderDark />
          </div>
        ) : products.length === 0 ? (
          <p>Aucune nouveauté pour le moment.</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* CTA vers tous les produits */}
            <div className="text-center mt-8">
              <Link
                href="/products"
                className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-600 transition"
              >
                Voir tous les produits
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewProductsPage;
