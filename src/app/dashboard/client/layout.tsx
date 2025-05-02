"use client";

import GamingLoader from "@/app/components/Loader/Loader";
import Sidebar from "./components/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "CLIENT") {
      router.replace("/login"); // Redirection si l'utilisateur n'est pas client
    } else {
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        router.replace("/login");
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center"><GamingLoader /></div>;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
