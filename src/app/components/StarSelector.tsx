"use client";

import { Star } from "lucide-react";

interface StarSelectorProps {
  label: string;
  value: number; // entre 0 et 3
  onChange: (value: number) => void;
}

const StarSelector: React.FC<StarSelectorProps> = ({ label, value, onChange }) => {
  return (
    <div className="mt-4">
      <label className="block mb-1 text-sm font-medium text-gray-300">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-1 ${value >= star ? "text-yellow-400" : "text-gray-500"}`}
          >
            <Star fill={value >= star ? "#facc15" : "none"} strokeWidth={1.5} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarSelector;
