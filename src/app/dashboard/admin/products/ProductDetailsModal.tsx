"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { ProductWithOptions } from "@/types";

const ProductDetailsModal: React.FC<{ productId: string; onClose: () => void }> = ({ productId, onClose }) => {
  const [product, setProduct] = useState<ProductWithOptions | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Erreur lors du chargement du produit");
        const data = await res.json();
        setProduct(data);

        const urls = Array.isArray(data.images)
        ? data.images.map((img: any) => img.url)
        : [];
        setSelectedImage(urls[0] || null);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) return null;

  const imageUrls = Array.isArray(product.images)
    ? product.images.map((img: any) => img.url)
    : [];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 overflow-hidden">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[90%] max-w-lg text-white relative overflow-y-auto max-h-[90vh]">
        <button className="absolute top-4 right-4 text-white text-2xl" onClick={onClose}>
          <X />
        </button>

        <h2 className="text-xl font-bold mb-1 flex items-center gap-3">
          {product.name}
          {product.isNew && (
            <span className="text-sm bg-yellow-500 text-black px-2 py-1 rounded-full font-semibold">
              Nouveau
            </span>
          )}
        </h2>
        <p className="text-gray-300 text-sm mb-2">Stock total : {product.stock}</p>

        {/* Image principale */}
        <div className="relative w-full h-64 mt-4 bg-white p-4 rounded-lg">
          {selectedImage ? (
            <Image src={selectedImage} alt={product.name} fill className="object-contain rounded-md" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Aucune image disponible
            </div>
          )}
        </div>

        {/* Miniatures */}
        {imageUrls.length > 0 && (
          <div className="flex gap-4 mt-4">
            {imageUrls.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 border-2 rounded-md overflow-hidden ${
                  img === selectedImage ? "border-red-500" : "border-gray-700"
                }`}
              >
                <Image
                  src={img}
                  alt={`Miniature ${index}`}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="mt-4 text-gray-300">{product.description}</p>

        {/* Listes des caractéristiques */}
        {product.specs && product.specs.length > 0 && (
          <div className="my-2">
            <h3 className="text-2xl font-bold text-red-400 mb-3">Caractéristiques</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {product.specs.map((spec: string, index: number) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Caractéristiques */}
        <h3 className="text-lg font-semibold mt-4">Variantes disponibles :</h3>
          <div className="mt-2 space-y-3">
            {product.options?.map((opt) => (
              <div key={opt.id}>
                <h4 className="text-md font-semibold text-yellow-400 mb-1">{opt.option.name}</h4>
                <ul className="pl-4 list-disc text-sm text-gray-300 space-y-1">
                  {opt.variants.map((variant, i) => {
                    const originalPrice = Number(variant.price);
                    const discounted = product.isPromo && product.promoPercentage
                      ? originalPrice - (originalPrice * (product.promoPercentage / 100))
                      : null;

                    return (
                      <li key={variant.id || i}>
                        {variant.quantity}g –
                        {discounted ? (
                          <>
                            <span className="line-through text-red-400 ml-1">
                              {originalPrice.toFixed(2)} €
                            </span>
                            <span className="ml-2 text-green-400 font-semibold">
                              {discounted.toFixed(2)} €
                            </span>
                          </>
                        ) : (
                          <span className="ml-1">{originalPrice.toFixed(2)} €</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>


        {/* Bouton fermer */}
        <button onClick={onClose} className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg w-full">
          Fermer
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
