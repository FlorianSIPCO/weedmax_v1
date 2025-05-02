"use client";

import { useEffect, useState } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  const handleCreate = async () => {
    if (!newCategory.trim()) return;
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory }),
    });
    setNewCategory("");
    fetchCategories();
  };

  const handleEdit = async () => {
    if (!editCategoryName.trim() || !editCategoryId) return;
    await fetch(`/api/categories?id=${editCategoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editCategoryName }),
    });
    setEditCategoryId(null);
    setEditCategoryName("");
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    fetchCategories();
  };

  return (
    <div className="max-w-3xl mx-auto py-10 text-white">
      <h1 className="text-2xl font-bold mb-6">Gestion des Catégories</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nom de la catégorie"
          className="p-2 bg-gray-800 border border-gray-600 rounded w-full"
        />
        <button onClick={handleCreate} className="bg-green-600 px-4 py-2 rounded">
          Ajouter
        </button>
      </div>

      <table className="w-full text-left border border-gray-600">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-3">Nom</th>
            <th className="p-3 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-t border-gray-600">
              <td className="p-3">
                {editCategoryId === cat.id ? (
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="p-1 bg-gray-800 border border-gray-500 rounded w-full"
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td className="p-3 flex gap-2">
                {editCategoryId === cat.id ? (
                  <button
                    className="text-green-400 hover:text-green-600"
                    onClick={handleEdit}
                  >
                    <Check size={16}/>
                  </button>
                ) : (
                  <button
                    className="text-blue-400 hover:text-blue-600"
                    onClick={() => {
                      setEditCategoryId(cat.id);
                      setEditCategoryName(cat.name);
                    }}
                  >
                    <Pencil size={16} />
                  </button>
                )}
                <button
                  className="text-red-400 hover:text-red-600"
                  onClick={() => handleDelete(cat.id)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan={2} className="p-3 text-center text-gray-400">
                Aucune catégorie disponible
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesPage;
