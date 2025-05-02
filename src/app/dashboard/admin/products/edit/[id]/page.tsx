"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ImageUploader from "@/app/dashboard/admin/components/ImageUploader";
import { UploadedImage } from "@/types";
import SpinnerButtons from "@/app/components/SpinnerButtons/SpinnerButtons";
import { PlusCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import GamingLoader from "@/app/components/Loader/Loader";

type VariantInput = { quantity: string; price: string };
type OptionBlock = { optionId: string; variants: VariantInput[] };

const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [optionsList, setOptionsList] = useState<{ id: string; name: string }[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stock: "",
    categoryId: "",
    images: [] as UploadedImage[],
    specs: [] as { key: string; value: string }[],
    isNew: false,
    isPromo: false,
    promoPercentage: "",
  });

  const [optionBlocks, setOptionBlocks] = useState<OptionBlock[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [prodRes, catRes, optRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch("/api/categories"),
          fetch("/api/options"),
        ]);

        const product = await prodRes.json();
        const cats = await catRes.json();
        const opts = await optRes.json();

        setCategories(cats);
        setOptionsList(opts);

        setFormData({
          name: product.name,
          description: product.description,
          stock: product.stock.toString(),
          categoryId: product.categoryId || "",
          images: product.images || [],
          specs: product.specs?.map((spec: string) => {
            const [key, ...rest] = spec.split(":");
            return { key: key.trim(), value: rest.join(":").trim() };
          }) || [],
          isNew: product.isNew ?? false,
          isPromo: product.isPromo ?? false,
          promoPercentage: product.promoPercentage?.toString() ?? "",
        });

        setOptionBlocks(
          product.options?.map((opt: any) => ({
            optionId: opt.optionId,
            variants: opt.variants.map((v: any) => ({
              quantity: v.quantity.toString(),
              price: v.price.toString(),
            })),
          })) || []
        );
      } catch (err) {
        toast.error("Erreur lors du chargement du produit.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSpecChange = (index: number, field: "key" | "value", value: string) => {
    const updated = [...formData.specs];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, specs: updated }));
  };

  const addSpec = () =>
    setFormData((prev) => ({ ...prev, specs: [...prev.specs, { key: "", value: "" }] }));

  const removeSpec = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));

  const addOptionBlock = () =>
    setOptionBlocks((prev) => [...prev, { optionId: "", variants: [{ quantity: "", price: "" }] }]);

  const removeOptionBlock = (index: number) =>
    setOptionBlocks((prev) => prev.filter((_, i) => i !== index));

  const changeOptionId = (index: number, id: string) =>
    setOptionBlocks((prev) =>
      prev.map((blk, i) => (i === index ? { ...blk, optionId: id } : blk))
    );

  const changeVariant = (i: number, vi: number, field: "quantity" | "price", value: string) =>
    setOptionBlocks((prev) =>
      prev.map((blk, idx) =>
        idx === i
          ? {
              ...blk,
              variants: blk.variants.map((v, j) => (j === vi ? { ...v, [field]: value } : v)),
            }
          : blk
      )
    );

  const addVariant = (i: number) =>
    setOptionBlocks((prev) =>
      prev.map((blk, idx) =>
        idx === i ? { ...blk, variants: [...blk.variants, { quantity: "", price: "" }] } : blk
      )
    );

  const removeVariant = (i: number, vi: number) =>
    setOptionBlocks((prev) =>
      prev.map((blk, idx) =>
        idx === i
          ? { ...blk, variants: blk.variants.filter((_, j) => j !== vi) }
          : blk
      )
    );

  const handleSave = async () => {
    setSaving(true);
    try {
      const formattedSpecs = formData.specs
        .filter((s) => s.key && s.value)
        .map((s) => `${s.key}: ${s.value}`);

      const formattedOptions = optionBlocks.map((opt) => ({
        optionId: opt.optionId,
        variants: opt.variants.map((v) => ({
          quantity: parseInt(v.quantity, 10),
          price: parseFloat(v.price.replace(",", ".")),
        })),
      }));

      const payload = {
        ...formData,
        stock: parseInt(formData.stock, 10),
        promoPercentage: formData.isPromo ? parseFloat(formData.promoPercentage.replace(",", ".")) : null,
        specs: formattedSpecs,
        options: formattedOptions,
      };

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      toast.success("Produit mis à jour !");
      router.push("/dashboard/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center"><GamingLoader /></div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Modifier le produit</h2>

      {/* CATEGORY + NAME + STOCK + DESCRIPTION */}
      <select
        value={formData.categoryId}
        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
        className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-3"
      >
        <option value="">-- Sélectionner une catégorie --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nom du produit"
        className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
      />

      <input
        type="text"
        name="stock"
        value={formData.stock}
        onChange={handleChange}
        placeholder="Stock"
        className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 rounded bg-gray-800 border border-gray-600 mb-2"
      />

      {/* PROMO + NOUVEAU */}
      <div className="flex items-center gap-8 mt-4">
        <div className="flex items-center gap-3">
        <label className="font-semibold">Nouveau produit</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isNew}
            onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-transform duration-300"></div>
        </label>

        <div className="flex items-center gap-3">
          <label className="font-semibold">En promotion</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPromo}
              onChange={(e) => setFormData({ ...formData, isPromo: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-transform duration-300"></div>
          </label>
        </div>

        <input
          type="text"
          inputMode="decimal"
          name="promoPercentage"
          id="promoPercentage"
          placeholder="% de réduction"
          value={formData.promoPercentage}
          disabled={!formData.isPromo}
          onChange={(e) => setFormData({ ...formData, promoPercentage: e.target.value })}
          className={`p-2 rounded bg-gray-800 border ${
            formData.isPromo ? "border-green-500" : "border-gray-700 opacity-50"
          } w-[180px]`}
        />
        </div>
      </div>

      {/* IMAGES */}
      <div className="mt-4">
        <ImageUploader onUploadComplete={(imgs) => setFormData((prev) => ({ ...prev, images: imgs }))} />
        {formData.images.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {formData.images.map((img, i) => (
              <Image key={i} src={img.url} alt="preview" width={100} height={80} className="rounded" />
            ))}
          </div>
        )}
      </div>

      {/* SPECS */}
      <h3 className="text-lg font-semibold mt-6">Spécifications :</h3>
      {formData.specs.map((spec, i) => (
        <div key={i} className="flex gap-2 items-center mt-2">
          <input
            type="text"
            placeholder="Clé"
            value={spec.key}
            onChange={(e) => handleSpecChange(i, "key", e.target.value)}
            className="w-1/3 p-2 rounded bg-gray-800 border border-gray-600"
          />
          <input
            type="text"
            placeholder="Valeur"
            value={spec.value}
            onChange={(e) => handleSpecChange(i, "value", e.target.value)}
            className="w-2/3 p-2 rounded bg-gray-800 border border-gray-600"
          />
          <button onClick={() => removeSpec(i)} className="text-red-400 hover:text-red-600">
            <Trash2 size={20} />
          </button>
        </div>
      ))}
      <button onClick={addSpec} className="text-blue-400 mt-3 flex items-center gap-2">
        <PlusCircle size={18} /> Ajouter une spécification
      </button>

      {/* OPTIONS + VARIANTS */}
      <h3 className="text-lg font-semibold mt-6">Options & Variantes :</h3>
      {optionBlocks.map((blk, i) => (
        <div key={i} className="mt-4 border-b pb-4">
          <div className="flex items-center gap-4">
            <select
              value={blk.optionId}
              onChange={(e) => changeOptionId(i, e.target.value)}
              className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded"
            >
              <option value="">-- Choisir une option --</option>
              {optionsList.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
            <button onClick={() => removeOptionBlock(i)} className="text-red-400 hover:text-red-600">
              <Trash2 size={18} />
            </button>
          </div>

          {blk.variants.map((v, vi) => (
            <div key={vi} className="flex gap-4 mt-3">
              <input
                type="number"
                placeholder="Quantité"
                value={v.quantity}
                onChange={(e) => changeVariant(i, vi, "quantity", e.target.value)}
                className="w-1/2 p-2 rounded bg-gray-800 border border-gray-600"
              />
              <input
                type="text"
                placeholder="Prix €"
                value={v.price}
                onChange={(e) => changeVariant(i, vi, "price", e.target.value)}
                className="w-1/2 p-2 rounded bg-gray-800 border border-gray-600"
              />
              <button onClick={() => removeVariant(i, vi)} className="text-red-400 hover:text-red-600">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button onClick={() => addVariant(i)} className="text-blue-400 mt-2 flex items-center gap-2">
            <PlusCircle size={18} /> Ajouter une variante
          </button>
        </div>
      ))}
      <button onClick={addOptionBlock} className="text-green-400 mt-4 flex items-center gap-2">
        <PlusCircle size={20} /> Ajouter une option
      </button>

      {/* BUTTONS */}
      <div className="flex mt-6">
        <button onClick={() => router.push("/dashboard/admin/products")} className="mr-4 bg-gray-600 px-5 py-2 rounded">
          Annuler
        </button>
        <button onClick={handleSave} className="bg-green-500 px-5 py-2 rounded" disabled={saving}>
          {saving ? <SpinnerButtons /> : "Enregistrer les modifications"}
        </button>
      </div>
    </div>
  );
};

export default EditProductPage;
