"use client";

const AboutUsPage = () => {
  return (
    <div className="bg-gradient-light min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-10 py-10 bg-white rounded-2xl">
        <h1 className="text-4xl font-bold mb-6 text-red-500 ">À propos de nous</h1>

        <p className="mb-4 text-lg text-justify">
          Bienvenue chez <strong>Weedmax</strong>, votre boutique en ligne spécialisée dans les produits à base de chanvre et de CBD.
          Nous sélectionnons avec soin chaque produit pour vous garantir une qualité irréprochable, dans le respect des réglementations françaises et européennes.
        </p>

        <p className="mb-4 text-lg text-justify">
          Notre équipe est composée de passionnés du bien-être naturel, désireux de rendre les bienfaits du CBD accessibles à tous. Transparence, qualité, écoute et innovation sont au cœur de notre démarche.
        </p>

        <p className="text-lg text-justify">
          Merci de votre confiance et bonne visite sur notre site !
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;
