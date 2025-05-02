"use client"

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import cgvData from "@/constants/cgu.json";

export default function CGUPage() {
    const [openItemId, setOpenItemId] = useState<number | null>(null);
  
    const toggleItem = (id: number) => {
      setOpenItemId(openItemId === id ? null : id);
    };
  
    const isItemOpen = (id: number) => openItemId === id;
    return (
      <main className="w-screen bg-black">
      <div className="max-w-4xl mx-auto p-6 text-white ">
        <h1 className="text-3xl font-bold text-pink-700 mb-4">Conditions Générales d'Utilisation (CGU)</h1>
        <p className="text-gray-300">Dernière mise à jour : 04-2025</p>

        <section className="mt-6 space-y-4">
          {cgvData.map((item) => (
            <div
              key={item.id}
              className="border-b border-gray-700 pb-4 transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full text-left flex justify-between items-center text-xl font-semibold cursor-pointer hover:text-pink-400 transition-colors"
              >
                <span>{item.title}</span>
                <ChevronDown
                  className={`transition-transform duration-300 ${
                    isItemOpen(item.id) ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isItemOpen(item.id) ? "max-h-[999px] opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-2 text-gray-200 px-1 py-2">
                  {item.content.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
    );
  }
  