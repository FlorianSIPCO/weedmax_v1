"use client";

import { useState } from "react";
import ProductDetailsModal from "./ProductDetailsModal";
import { Trash2, Eye, Pencil } from "lucide-react";
import ReactDOM from "react-dom";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { ProductWithOptions } from "@/types";
import { useRouter } from "next/navigation";

const ProductRow: React.FC<{ product: ProductWithOptions }> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const deleteProduct = async () => {
    setIsDeleting(true);
    try {
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    window.location.reload();
    } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const displayPrice = (() => {
    const allVariants = product.options.flatMap((opt) => opt.variants);
    if (!allVariants.length) return "N/A";
    const minPrice = Math.min(...allVariants.map((v) => Number(v.price)));
    return `${minPrice.toFixed(2)} €`;
  })();

  const totalStock = product.stock;


  return (
    <>
      <tr className="border-b border-gray-600">
        <td className="p-3">{product.name}</td>
        <td className="p-3">{product.category?.name || "Non catégorisé"}</td>
        <td className="p-3">{displayPrice}</td>
        <td className="p-3 text-center">{totalStock}</td>
        <td className="p-3 text-center">
          {product.isPromo ? (
            <span className="text-green-400 font-semibold">
              {product.promoPercentage ? `-${product.promoPercentage}%` : "Oui"}
            </span>
          ) : (
            <span className="text-gray-500">–</span>
          )}
        </td>
        <td className="p-3 text-center">
          {product.isNew ? (
            <span className="text-yellow-400 font-semibold">Nouveau</span>
          ) : (
            <span className="text-gray-500">–</span>
          )}
        </td>


        {/* CTA */}
        <td className="p-3 flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="text-blue-400 hover:text-blue-600">
            <Eye size={18} />
          </button>
          <button onClick={() => router.push(`/dashboard/admin/products/edit/${product.id}`)} className="text-blue-400 hover:text-blue-600">
            <Pencil size={18} />
          </button>
          <button onClick={() => setShowDeleteModal(true)} className="text-red-400 hover:text-red-600">
            <Trash2 size={18} />
          </button>
        </td>
      </tr>

      {/* Affichage de la modal au clic */}
      {isModalOpen && ReactDOM.createPortal(<ProductDetailsModal productId={product.id} onClose={() => setIsModalOpen(false)} />, document.body)}
      {showDeleteModal && ReactDOM.createPortal(<DeleteConfirmationModal onConfirm={deleteProduct} onCancel={() => setShowDeleteModal(false)} isLoading={isDeleting} />, document.body)}
    </>
  );
};

export default ProductRow;
