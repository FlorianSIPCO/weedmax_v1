"use client";

import { useEffect, useState } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";

type Option = { id: string; name: string };

const OptionsPage = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [newOption, setNewOption] = useState("");

  const [editId,   setEditId]   = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const fetchOptions = async () => {
    const res  = await fetch("/api/options");
    const data = await res.json();
    setOptions(data);
  };

  const createOption = async () => {
    if (!newOption.trim()) return;
    await fetch("/api/options", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({ name: newOption }),
    });
    setNewOption("");
    fetchOptions();
  };

  const updateOption = async () => {
    if (!editName.trim() || !editId) return;
    await fetch(`/api/options/${editId}`, {
      method : "PUT",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({ name: editName }),
    });
    setEditId(null);
    setEditName("");
    fetchOptions();
  };

  const deleteOption = async (id: string) => {
    await fetch(`/api/options/${id}`, { method: "DELETE" });
    fetchOptions();
  };

  useEffect(() => { fetchOptions(); }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 text-white">
      <h1 className="text-2xl font-bold mb-6">Gestion des Options</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Nom de l'option (ex. CBD)"
          className="p-2 bg-gray-800 border border-gray-600 rounded w-full"
        />
        <button onClick={createOption} className="bg-green-600 px-4 py-2 rounded">
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
          {options.map((opt) => (
            <tr key={opt.id} className="border-t border-gray-600">
              <td className="p-3">
                {editId === opt.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="p-1 bg-gray-800 border border-gray-500 rounded w-full"
                  />
                ) : (
                  opt.name
                )}
              </td>
              <td className="p-3 flex gap-2">
                {editId === opt.id ? (
                  <button
                    className="text-green-400 hover:text-green-600"
                    onClick={updateOption}
                    title="Valider"
                  >
                    <Check size={16} />
                  </button>
                ) : (
                  <button
                    className="text-blue-400 hover:text-blue-600"
                    onClick={() => {
                      setEditId(opt.id);
                      setEditName(opt.name);
                    }}
                    title="Modifier"
                  >
                    <Pencil size={16} />
                  </button>
                )}

                <button
                  className="text-red-400 hover:text-red-600"
                  onClick={() => deleteOption(opt.id)}
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}

          {options.length === 0 && (
            <tr>
              <td colSpan={2} className="p-3 text-center text-gray-400">
                Aucune option disponible
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OptionsPage;
