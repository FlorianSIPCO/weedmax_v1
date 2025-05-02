import Navbar from "./Navbar"
import CookieBanner from "./CookieBanner"
import Footer from "./Footer"

export default function Layout({ children }: { children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <CookieBanner />
      <main className="bg-gray-100 text-gray-800 flex-grow">{children}</main>
      <Footer />
    </div>
  )
}