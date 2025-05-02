"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductWithOptions } from "@/types";
import ProductCard from "@/app/components/ProductCard";
import LoaderDark from "@/app/components/Loader/LoaderDark";

const CategoryProductsPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState<ProductWithOptions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await fetch(`/api/products?category=${slug}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Erreur lors du chargement des produits :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug]);

  return (
    <div className="bg-gradient-light">
      <div className="p-6 text-white max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 capitalize">{slug}</h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoaderDark />
          </div>
        ) : products.length === 0 ? (
          <p>Aucun produit trouvé dans cette catégorie.</p>
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

export default CategoryProductsPage;
