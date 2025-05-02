"use client";
import { ImageIcon } from "lucide-react";
import { useRef, useState } from "react";

type UploadedImage = {
  url: string;
  public_id: string;
}

type Props = {
  onUploadComplete: (images: UploadedImage[]) => void;
};

export default function ImageUploader({ onUploadComplete }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    const uploadedImages: UploadedImage[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url && data.public_id) {
        uploadedImages.push({
          url: data.secure_url,
          public_id: data.public_id
        });
      }
    }
    onUploadComplete(uploadedImages);
    setUploading(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  }

  return (
    <div className="space-y-4">
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleChange} className="hidden" />
      <button
        type="button"
        onClick={handleClick}
        className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 flex items-center gap-2"
      >
        <ImageIcon size={18} /> Choisir une image

      </button>
      {uploading && <p>Envoi en cours...</p>}
    </div>
  );
}
