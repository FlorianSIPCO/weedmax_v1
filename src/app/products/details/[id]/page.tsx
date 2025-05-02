"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ProductWithOptions } from "@/types";
import { Star } from "lucide-react";
import LoaderDark from "@/app/components/Loader/LoaderDark";
import { FaCartPlus } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import RatingModal from "@/app/components/RatingModal";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductWithOptions | null>(null);
  const [selectedOption, setSelectedOption] = useState<ProductWithOptions["options"][0] | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductWithOptions["options"][0]["variants"][0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        if (data?.options?.length > 0) {
          setSelectedOption(data.options[0]);
          setSelectedVariant(data.options[0]?.variants[0]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du produit :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <LoaderDark />;
  if (!product || !selectedOption || !selectedVariant) return <p className="text-white p-4">Produit introuvable.</p>;

  const imageUrl = product.images?.[0]?.url || "/images/logo.jpg";

  // Effet zoom sur image hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = imageContainerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;
    setZoomPosition({ x, y });
    setIsZooming(true);
  }

  const handleMouseLeave = () => {
    setIsZooming(false);
  }

  // Calcul du prix en promo
  const promoPrice =
    product.isPromo && product.promoPercentage
      ? Number(selectedVariant?.price) -
        (Number(selectedVariant?.price) * product.promoPercentage) / 100
      : null;

  // Gestion des avis avec controle du localStorage
  const handleRatingClick = (rating: number) => {
    const alreadyReviewed = localStorage.getItem(`reviewed_${product.id}`);
    if (alreadyReviewed) {
      return alert("Vous avez déjà noté ce produit.");
    }
    setSelectedRating(rating);
    setShowRatingModal(true);
  };

  // Logique pour un affichage des unités en fonction du produit
  const getUnit = () => {
    const cat = product.category?.name?.toLowerCase() || "";
    if (cat.includes("huile")) return "ml";
    if (cat.includes("vape")) return null;
    return "g";
  };

  return (
    <div className="bg-gradient-light min-h-screen py-12 flex items-center">
      <div className="p-6 max-w-5xl mx-auto text-white bg-white rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Images */}
          <div>
            {/* Image principale */}
            <div 
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-96 bg-white rounded-lg overflow-hidden mb-4"
            >
              <Image 
                src={product.images[selectedImageIndex]?.url || "/images/logo_weedmax.jpg"} 
                alt={product.name} 
                fill 
                className={`object-contain transition-opacity duration-300 ${
                  isZooming ? "opacity-0" : "opacity-100"
                }`} 
              />

              {isZooming && (
                  <div
                    className="absolute inset-0 bg-no-repeat bg-contain"
                    style={{
                      backgroundImage: `url(${product.images[selectedImageIndex]?.url})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundSize: "200%", // Zoom x2
                    }}
                  />
                )}
            </div>

            {/* Miniature */}
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 border rounded cursor-pointer ${
                    selectedImageIndex === index ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <Image src={img.url} alt={`mini-${index}`} fill className="object-cover rounded" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2 text-red-400">{product.name}</h1>
            <p className="text-black mb-4 text-justify">{product.description}</p>

            <div className="mb-4">
              {product.isPromo && promoPrice !== null ? (
                <div className="text-red-400 text-lg font-semibold">
                  <span className="line-through text-gray-500 mr-2">
                    {Number(selectedVariant.price).toFixed(2)} €
                  </span>
                  <span>{promoPrice.toFixed(2)} €</span>
                </div>
              ) : (
                <div className="text-red-400 text-2xl font-semibold">
                  {Number(selectedVariant.price).toFixed(2)} €
                </div>
              )}
            </div>

            {product.specs && product.specs.length > 0 && (
              <div className="my-2">
                <h3 className="text-2xl font-bold text-red-400 mb-3">Caractéristiques</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-800 text-sm">
                  {product.specs.map((spec: string, index: number) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className="cursor-pointer"
                  fill={i + 1 <= (selectedRating || product.rating || 0) ? "#facc15" : "none"}
                  stroke="#facc15"
                  onClick={() => handleRatingClick(i + 1)}
                />
              ))}
              <span className="text-sm text-gray-400">({product.reviewCount || 0} avis)</span>
            </div>

            {/* Selection option */}
            {product.options.length > 1 && (
              <select
                className="text-gray-800 w-full p-2 rounded border text-sm mb-4"
                value={selectedOption?.optionId}
                onChange={(e) => {
                  const opt = product.options.find(o => o.optionId === e.target.value);
                  if (opt) {
                    setSelectedOption(opt);
                    setSelectedVariant(opt.variants[0]);
                  }
                }}
              >
                {product.options.map((opt) => (
                  <option key={opt.optionId} value={opt.optionId}>
                    {opt.option.name}
                  </option>
                ))}
              </select>
            )}

            {/* Sélection variant */}
            <select
              className="text-gray-800 w-full p-2 rounded border text-sm mb-4"
              value={selectedVariant?.id}
              onChange={(e) => {
                const variant = selectedOption.variants.find(v => v.id === e.target.value);
                if (variant) setSelectedVariant(variant);
              }}
            >
              {selectedOption.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {getUnit() ? `${variant.quantity} ${getUnit()} - ` : ""}
                  {product.isPromo && product.promoPercentage
                    ? (Number(variant.price) - (Number(variant.price) * product.promoPercentage) / 100).toFixed(2)
                    : Number(variant.price).toFixed(2)} €
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product.name,
                  image: imageUrl,
                  quantity: 1,
                  variantId: selectedVariant.id,
                  variantQuantity: selectedVariant.quantity,
                  price: Number(selectedVariant.price),
                });
              }}
              className="px-6 py-3 bg-red-500 cursor-pointer text-white rounded-lg hover:scale-105 transition w-full"
            >
              <FaCartPlus className="inline-block mr-2" />
              Ajouter au panier
            </button>
          </div>
        </div>

        {showRatingModal && (
          <RatingModal
            productId={product.id}
            initialRating={selectedRating}
            onClose={() => setShowRatingModal(false)}
            onReviewSubmitted={(newRating, newCount) => {
              setSelectedRating(null);
              setProduct((prev) =>
                prev
                  ? {
                      ...prev,
                      rating: newRating,
                      reviewCount: newCount,
                    }
                  : null
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
