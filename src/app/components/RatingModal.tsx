"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import SpinnerButtons from "./SpinnerButtons/SpinnerButtons";

type Props = {
  productId: string;
  initialRating: number | null;
  onClose: () => void;
  onReviewSubmitted?: (newRating: number, newReviewCount: number) => void;
};

const RatingModal = ({ productId, onClose, initialRating, onReviewSubmitted }: Props) => {
  const [rating, setRating] = useState<number>(initialRating || 0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitReview = async () => {
    if (!rating) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi de l'avis");

      const updatedProduct = await res.json();

      if (onReviewSubmitted) {
        onReviewSubmitted(updatedProduct.rating, updatedProduct.reviewCount);
      }
      localStorage.setItem(`reviewed_${productId}`, "true");
      onClose(); // ferme la modal après succès
    } catch (error) {
      console.error("Erreur soumission avis :", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button className="absolute top-3 right-3 text-gray-600" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold text-center mb-4 text-gray-800">Laissez votre avis</h2>

        <div className="flex justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => {
            const value = i + 1;
            return (
              <Star
                key={i}
                size={28}
                className="cursor-pointer transition"
                fill={hovered !== null ? (value <= hovered ? "#facc15" : "none") : (value <= rating ? "#facc15" : "none")}
                stroke="#facc15"
                onMouseEnter={() => setHovered(value)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setRating(value)}
              />
            );
          })}
        </div>

        <textarea
          placeholder="Laissez un commentaire (optionnel)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded text-sm text-gray-800"
        />

        <button
          onClick={submitReview}
          disabled={submitting || rating === 0}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
        >
          {submitting ? <SpinnerButtons /> : "Envoyer mon avis"}
        </button>
      </div>
    </div>
  );
};

export default RatingModal;
