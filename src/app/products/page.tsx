"use client";

import { useEffect, useState } from "react";
import { ProductWithOptions } from "@/types";
import ProductCard from "@/app/components/ProductCard";
import LoaderDark from "../components/Loader/LoaderDark";

const AllProductsPage = () => {
  const [products, setProducts] = useState<ProductWithOptions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Erreur lors du chargement des produits :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  return (
    <div className="bg-gradient-light min-h-screen pb-12">
        <div className="p-6 text-white max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Tous les produits</h1>

        {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
                <LoaderDark />
            </div>
        ) : products.length === 0 ? (
            <p>Aucun produit disponible.</p>
        ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        )}
        </div>
    </div>
  );
};

export default AllProductsPage;
