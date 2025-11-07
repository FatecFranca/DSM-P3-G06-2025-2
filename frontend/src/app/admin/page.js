"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import AdminCard from "@/components/admin/AdminCard";
import {
  Users,
  BookOpen,
  GraduationCap,
  Library,
  FileText,
  Lightbulb,
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { user } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Carregando...
      </div>
    );
  }

  const adminFunctions = [
    {
      id: "usuarios",
      title: "Gerenciar Usuários",
      description: "Cadastrar, editar e gerenciar usuários do sistema",
      icon: Users,
      route: "/admin/usuarios",
    },
    {
      id: "livros",
      title: "Gerenciar Livros",
      description: "Adicionar, editar e remover livros do acervo",
      icon: BookOpen,
      route: "/admin/livros",
    },
    {
      id: "cursos",
      title: "Gerenciar Cursos",
      description: "Administrar cursos e suas relações com livros",
      icon: GraduationCap,
      route: "/admin/cursos",
    },
    {
      id: "exemplares",
      title: "Gerenciar Exemplares",
      description: "Controlar exemplares físicos dos livros",
      icon: Library,
      route: "/admin/exemplares",
    },
    {
      id: "emprestimos",
      title: "Gerenciar Empréstimos",
      description: "Acompanhar e gerenciar empréstimos ativos",
      icon: FileText,
      route: "/admin/emprestimos",
    },
    {
      id: "sugestoes",
      title: "Sugestões de Livros",
      description: "Gerenciar sugestões de livros dos usuários",
      icon: Lightbulb,
      route: "/admin/sugestoes",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminFunctions.map((func) => (
          <AdminCard
            key={func.id}
            title={func.title}
            description={func.description}
            icon={func.icon}
            onClick={() => router.push(func.route)}
          />
        ))}
      </div>
    </div>
  );
}
