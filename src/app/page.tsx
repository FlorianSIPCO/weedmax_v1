"use client"
import Link from "next/link";
import { motion } from 'framer-motion'
import ButtonNeon from "./components/ButtonNeon";

export default function Home() {
  return (
    <main className="bg-black text-white relative flex flex-col items-center justify-center bg-[url('/images/test-bg.jpg')] bg-cover bg-center bg-no-repeat w-screen">
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-2 transform flex flex-row justify-center items-center mt-4 gap-4 md:gap-10 z-10 px-4 w-full"
      >
        <ButtonNeon 
          href='/products/nouveautes'
          textColor="text-sky-200" 
          neonColor="shadow-[0_0_0_1px_#fff,inset_0_0_0_1px_#fff,0_0_3px_#00aeff,0_0_5px_#00aeff,0_0_10px_#00aeff,0_0_15px_#00aeff]"
        >
          Nouveautés
        </ButtonNeon>

        <ButtonNeon 
          href='/about-us'
          textColor="text-pink-300" 
          neonColor="shadow-[0_0_0_1px_#fff,inset_0_0_0_1px_#fff,0_0_3px_#fff2cd,0_0_5px_#fff2cd,0_0_10px_#fff2cd,0_0_15px_#ed4254]"
        >
          A propos
        </ButtonNeon>

        <ButtonNeon 
          href='/contact'
          textColor="text-green-300" 
          neonColor="shadow-[0_0_0_1px_#fff,inset_0_0_0_1px_#fff,0_0_3px_#34db34,0_0_5px_#34db34,0_0_10px_#34db34,0_0_15px_#34db34]"
        >
          Contact
        </ButtonNeon>
      </motion.div>

      {/* Image de fond animée
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/test-bg.jpg"
          alt="Hero Background"
          fill
          className="object-contain w-full h-full brightness-60 pt-14"
        />
      </motion.div> */}

      {/* Contenu textuel animé */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 text-center max-w-xl bg-black bg-opacity-70 p-8 rounded-xl mt-20"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-5xl font-bold mb-4 tracking-widest"
        >
          Bienvenue chez <span className="bg-gradient-light bg-clip-text text-transparent">Weedmax</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-lg mb-6"
        >
          Explorez notre gamme de produits premium, <br/>
          entièrement légaux, conçus pour vous offrir <br/>
          une expérience unique
        </motion.p>

         {/* Bouton CTA animé avec effet "pop" */}
         <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2, type: "spring", stiffness: 120 }}
        >
          <Link
            href="/products"
            className="relative mt-6 inline-block bg-gradient-light-reverse px-6 py-3 rounded-full shadow-lg text-primary font-bold transition-transform hover:scale-105 overflow-hidden"
          >
            Voir la boutique
            
          </Link>
        </motion.div>


      </motion.div>

      {/* Cards section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="my-10 grid grid-cols-1 md:grid-cols-3 gap-6 z-10 px-6"
      >
        {[
          {
            title: "CBD",
            effet: 1,
            description: "Détente douce, sans effet psychoactif",
            textColor: "text-green-300",
            neonColor: "shadow-[0_0_0_1px_#fff,inset_0_0_0_1px_#fff,0_0_3px_#34db34,0_0_5px_#34db34,0_0_10px_#34db34,0_0_15px_#34db34]",
          },
          {
            title: "MCP-N",
            effet: 2,
            description: "Relaxation intense, idéal en fin de journée",
            textColor: "text-green-300",
            neonColor: "shadow-[0_0_0_1px_#fff,inset_0_0_0_1px_#fff,0_0_3px_#34db34,0_0_5px_#34db34,0_0_10px_#34db34,0_0_15px_#34db34]",
          },
          {
            title: "Delta-BZ10",
            effet: 3,
            description: "Effet fort et rapide, pour utilisateurs avertis",
            textColor: "text-green-300",
            neonColor: "shadow-[0_0_0_1px_#fff,inset_0_0_0_1px_#fff,0_0_3px_#34db34,0_0_5px_#34db34,0_0_10px_#34db34,0_0_15px_#34db34]",
          },
        ].map((declinaison, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center text-center bg-gradient-to-br ${declinaison.textColor} ${declinaison.neonColor} rounded-xl p-4 bg-opacity-30 border border-current backdrop-blur transition-transform hover:scale-105 hover:brightness-110 duration-300`}
          >
            <h3 className="text-2xl font-bold mb-2">{declinaison.title}</h3>
            <div className="flex justify-center items-center">
              <p className="text-md uppercase tracking-wider mb-1 text-white/80">Effet</p>
              <div className="flex justify-center mb-2">
                {Array.from({ length: declinaison.effet }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg ml-2">★</span>
                ))}
              </div>
            </div>

            <p className="text-lg text-white/90">{declinaison.description}</p>
          </div>
        ))}
      </motion.div>
    </main>
  );
}
