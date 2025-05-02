"use client";

import ProductTable from "./ProductTable";
import Link from "next/link";

const ProductsPage = () => {
  return (
    <div className="text-white">
      <h1 className="text-center lg:text-left text-2xl lg:text-3xl font-bold mb-6">Gestion des Produits</h1>
      <Link 
        href='/dashboard/admin/products/create'
        className="inline-block bg-blue-500 px-4 py-2 mb-5 cursor-pointer rounded-md text-white hover:bg-blue-600"
      >
        Ajouter un produit
      </Link>
      <ProductTable />
    </div>
  );
};

export default ProductsPage;
