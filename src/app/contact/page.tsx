"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import SpinnerButtons from "../components/SpinnerButtons/SpinnerButtons";
import { LuMapPin, LuPhone, LuMail } from "react-icons/lu";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { FaXTwitter, FaFacebook } from "react-icons/fa6";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    console.log("Message envoyé :", form);
    setSubmitted(true);
  };

  const inputStyle =
    "w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:border-pink-400 focus:ring-2 focus:ring-pink-400 transition-all outline-none";

  return (
    <div className="min-h-screen bg-gradient-light py-12 px-6 text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl border border-none p-8"
      >
        <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-main">
          Contactez-nous
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Infos Contact + Carte */}
          <div className="md:w-1/2 space-y-4">
            <div className="bg-none text-black p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-left">
                <h2 className="text-2xl font-semibold mr-2 text-purple-900"><LuMapPin /></h2>
                <a 
                  href="https://www.google.com/maps?q=122+Grande+Rue,+76750+Buchy,+France"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-medium hover:underline transition-colors duration-200"
                >
                  122 Grande Rue, 76750 Buchy, France
                </a>
              </div>
              <div className="flex items-center justify-left">
                <h2 className="text-2xl font-semibold mr-2 text-purple-900"><LuPhone /></h2>
                <a href="tel:+33235348003" className="text-xl font-medium hover:underline transition-colors duration-200">02 35 34 80 03</a>
              </div>
              <div className="flex items-center justify-left">
                <h2 className="text-2xl font-semibold mr-2 text-purple-900"><LuMail /></h2>
                <a href="mailto:contact@weedmaxcbd.fr" className="text-xl font-medium hover:underline transition-colors duration-200">contact@weedmaxcbd.fr</a>
              </div>
              <div className="flex items-center justify-left">
                <h2 className="text-xl font-semibold mr-2 text-purple-900">Suivez-nous :</h2>
                <div className="text-xl font-medium flex gap-4">
                  {/* Instagram */}
                  <a
                    href={
                      typeof window !== "undefined" && /iPhone|Android/i.test(navigator.userAgent)
                        ? "instagram://user?username=weedmax"
                        : "https://www.instagram.com/weedmax"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BiLogoInstagramAlt
                      size={38}
                      className="hover:text-[#E1306C] transition duration-300 transform hover:scale-110"
                    />
                  </a>

                  {/* Facebook */}
                  <a
                    href={
                      typeof window !== "undefined" && /iPhone|Android/i.test(navigator.userAgent)
                        ? "fb://page/weedmax" // ou ID numérique si dispo
                        : "https://www.facebook.com/weedmax"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook
                      size={34}
                      className="hover:text-[#0866ff] transition duration-300 transform hover:scale-110"
                    />
                  </a>

                  {/* Twitter (X) */}
                  <a
                    href={
                      typeof window !== "undefined" && /iPhone|Android/i.test(navigator.userAgent)
                        ? "twitter://user?screen_name=weedmax"
                        : "https://twitter.com/weedmax"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaXTwitter
                      size={34}
                      className="text-black hover:text-gray-700 transition duration-300 transform hover:scale-110"
                    />
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-md border border-gray-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2586.699117650194!2d1.3521589295698562!3d49.5845642975745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e0cde110ee8401%3A0x248390f759d7328e!2sWeedmax!5e0!3m2!1sfr!2sfr!4v1744382093024!5m2!1sfr!2sfr"
                width="600"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Formulaire */}
          <div className="md:w-1/2 bg-black/70 p-6 rounded-xl">
            {submitted ? (
              <p className="text-green-400 text-lg">
                Merci pour votre message ! Nous reviendrons vers vous rapidement.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Nom</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-main hover:scale-105 transition text-white font-bold py-3 rounded-xl shadow-lg"
                >
                  {loading ? <SpinnerButtons /> : "Envoyer"}
                </button>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-center font-medium"
                  >
                    {error}
                  </motion.p>
                )}
                {success && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-center font-medium"
                  >
                    {success}
                  </motion.p>
                )}
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
