"use client";

import { useEffect, useState } from "react";
import ProductRow from "./ProductRow";
import { ProductWithOptions } from "@/types";

const ProductTable = () => {
  const [products, setProducts] = useState<ProductWithOptions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Erreur lors de la récupération des produits");
        const data = await res.json();

        // Tri par date de création décroissante
        const sorted = data.sort((a: ProductWithOptions, b: ProductWithOptions) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setProducts(sorted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-white p-4">Chargement des produits...</p>;
  }

  if (products.length === 0) {
    return <p className="text-white p-4">Aucun produit trouvé.</p>;
  }

  return (
    <div className="w-full bg-gray-800 p-6 rounded-lg overflow-x-auto">
      <table className="w-full text-white">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="text-left p-3">Nom</th>
            <th className="text-left p-3">Catégorie</th>
            <th className="text-left p-3">Prix (min)</th>
            <th className="text-left p-3">Stock</th>
            <th className="text-center p-3">Promo</th>
            <th className="text-center p-3">Nouveau</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
