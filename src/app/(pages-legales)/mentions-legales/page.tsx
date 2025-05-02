export default function MentionsLegalesPage() {
  return (
    <main className="w-screen bg-black">
      <div className="max-w-4xl mx-auto p-6 text-white">
        <h1 className="text-3xl font-bold text-pink-700 mb-4">Mentions légales</h1>
        <p className="text-gray-300">Dernière mise à jour : 04-2025</p>
        <section className="mt-6 space-y-4">
          <h2 className="text-2xl font-semibold text-pink-300">Editeur</h2>
          <ul>
            <li>Le site est édité par <strong>Weedmax</strong>,</li>
            <li>dont le siège social est situé au <strong>122 Grande rue 76750 BUCHY</strong></li>
            <li>N° SIRET : <strong>93418875600019</strong>, N° TVA INTRACOMMUNAUTAIRE : <strong>FR85934188756</strong></li>
            <li>Tél. : <strong>02 35 34 80 03</strong></li>
            <li>Email : <strong>weedmaxcbd@gmail.com</strong></li>
          </ul>

          <h2 className="text-2xl font-semibold text-pink-300">Conception / Réalisation / Hébergement</h2>
          <ul>
            <li>Réalisé par <strong><a href="https://boucletflorian.com/" target="_blank" rel="noopener noreferrer">Bouclet Florian</a></strong>,</li>
            <li>Hébergé par <strong>Vercel</strong>,</li>
            <li>Siège social : <strong>San Francisco États-Unis</strong></li>
          </ul>

          <h2 className="text-2xl font-semibold text-pink-300">Propriété intellectuelle</h2>
          <p className="space-y-2 text-gray-200 px-1 py-2 text-justify">
            La structure générale du site, ainsi que les textes, graphiques, images, sons et vidéos la
            composant, sont la propriété de Weedmax.<br />
            Toute représentation et/ou reproduction et/ou
            exploitation partielle ou totale de ce site, par quelque procédé que ce soit, sans l'autorisation
            préalable et par écrit de Weedmax est strictement interdite et serait susceptible de constituer une
            contrefaçon au sens des articles L 335-2 et suivants du Code de la propriété intellectuelle.
          </p>
        </section>
      </div>
    </main>
  );
}
