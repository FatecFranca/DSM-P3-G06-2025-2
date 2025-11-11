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
    if (!user && pathname !== "/login") {
      router.push("/login");
    }

    if (user && pathname === "/login") {
      router.push("/");
    }
  }, [user, pathname, router]);

  if (!user && pathname !== "/login") {
    return null;
  }

  return (
    <>
      {user && <Header />}
      <main className="container mx-auto px-6 py-8">{children}</main>
    </>
  );
}
