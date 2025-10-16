//! Base da template

"use client";

import { useApp } from "@/contexts/AppContext";
import { Header } from "@/components/layout/Header";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Template({ children }) {
  const { user } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Se não tá logado e não tá na página de login, manda pra login
    if (!user && pathname !== '/login') {
      router.push('/login');
    }
    
    // Se já tá logado e tá na página de login, manda pra home
    if (user && pathname === '/login') {
      router.push('/');
    }
  }, [user, pathname, router]);

  // Se não tá logado e não é página de login, não renderiza nada
  if (!user && pathname !== '/login') {
    return null;
  }

  return (
    <>
      {user && <Header />}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </>
  );
}
