import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/context/SessionProviderWrapper";
import { CartProvider } from "@/context/CartContext";
import LayoutWrapper from "./components/LayoutWrapper";
import { Toaster } from "react-hot-toast";
import CartModal from "./components/CartModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weedmax",
  description: "",
  metadataBase: new URL('http://localhost:3000/'),
  keywords: "Weedmax, CBD, Buchy, vapes, e-cigarette",
  robots: "index, follow", // Google
  openGraph: { // Facebook, LinkedIn, Discord
    type: "website",
    title: "Weedmax",
    description: "",
    url: "http://localhost:3000/", // Confirmer URL
    images: [
      {
        url: "/images/logo.jpg", // Image de prévisualisation pour les réseaux sociaux
        width: 1200,
        height: 630,
        alt: "Weedmax",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weedmax",
    description: "",
    images: ["/images/logo.jpg"],
  },
};

export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProviderWrapper>
          <CartProvider>
            <LayoutWrapper>
              <Toaster position="bottom-center" reverseOrder={false} />
              {children}
            </LayoutWrapper>
            <CartModal />
          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
