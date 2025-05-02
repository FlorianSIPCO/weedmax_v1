"use client"

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import cgvData from "@/constants/legacy.json";

export default function PolitiqueDeConfidentialitePage() {
    const [openItemId, setOpenItemId] = useState<number | null>(null);

    const toggleItem = (id: number) => {
      setOpenItemId(openItemId === id ? null : id);
    };

    const isItemOpen = (id: number) => openItemId === id;
    return (
      <main className="w-screen bg-black">
        <div className="max-w-4xl mx-auto p-6 text-white ">
          <h1 className="text-3xl font-bold text-pink-700 mb-4">Politique de confidentialité</h1>
          <p className="text-gray-300">Dernière mise à jour : 04-2025</p>

          <section className="mt-6 space-y-4">
            <p className="space-y-2 text-gray-200 px-1 py-2">
              La présente Politique a pour objet d'apporter les informations nécessaires à la compréhension des différents traitements que nous réalisons afin de mener à bien nos missions et de fournir les services qui vous sont les plus adaptés.
            </p>
            <p className="mt-6 space-y-4">
              Pour rappel, la réglementation européenne définit une donnée à caractère personnel (ci-après « données personnelles ») comme toute information relative à une personne physique identifiée ou qui peut être identifiée, directement ou indirectement, par référence à un numéro d'identification, ou à un ou plusieurs éléments qui lui sont propres. La mise en œuvre de traitements automatisés de données personnelles est notamment régie par le Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016, entré en vigueur le 25 mai 2018, relatif à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, ci-après désigné «RGPD».
            </p>
            <p className="mt-6 space-y-4 italic">
              « Chers artisans, Nous souhaitons vous informer d'un changement dans le traitement de vos données personnelles dans le cadre de la gestion du répertoire des métiers. En effet, dans le cadre du décret n° 2020-946 et de la loi PACTE du 22 mai 2019 l'Institut National de la Propriété Industrielle (INPI) se voit attribué, à compter du 1er janvier 2023 la gestion du « Guichet unique », ce dernier permet aux créateurs d'entreprise et aux entreprises d'accomplir par voie électronique, toutes les formalités liées à la vie de leur entreprise. Pour plus d'information sur le traitement réalisé par l'INPI avec vos données à caractère personnel, nous vous invitons à contacter le Délégué à la Protection des Données de l'INPI. »
            </p>
          </section>

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
                    {Array.isArray(item.content) ? (
                      item.content.map((line, index) => (
                        <p key={index}>{line}</p>
                      ))
                    ): (
                      <p>{item.content}</p>
                    )}

                    {/* Affichage optionnel d'une liste */}
                    {item.list && (
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        {item.list.map((li: string, i: number) => (
                          <li key={i}>{li}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    );
  }
  