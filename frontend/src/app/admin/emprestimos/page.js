"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import EmprestimoCard from "@/components/cards/EmprestimoCard";
import { api } from "@/app/services/api";
import { toast } from "sonner";

export default function AdminEmprestimosPage() {
  const router = useRouter();
  const { user } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [emprestimos, setEmprestimos] = useState([]);

  // Carregar empréstimos
  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    const carregarEmprestimos = async () => {
      try {
        setIsLoading(true);
        const data = await api.emprestimos.listar();
        setEmprestimos(data);
      } catch (error) {
        console.error("Erro ao carregar empréstimos:", error);
        toast.error("Erro ao carregar empréstimos");
      } finally {
        setIsLoading(false);
      }
    };

    carregarEmprestimos();
  }, [user, router]);

  const handleFinalize = async (id) => {
    if (!window.confirm("Tem certeza que deseja finalizar este empréstimo?")) {
      return;
    }

    try {
      await api.emprestimos.finalizar(id);
      toast.success("Empréstimo finalizado com sucesso!");

      // Atualizar a lista de empréstimos
      const emprestimosAtualizados = await api.emprestimos.listar();
      setEmprestimos(emprestimosAtualizados);
    } catch (error) {
      console.error("Erro ao finalizar empréstimo:", error);
      toast.error("Erro ao finalizar empréstimo");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Carregando...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gerenciar Empréstimos</h1>
        </div>
      </div>

      {emprestimos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum empréstimo encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {emprestimos.map((emprestimo) => (
            <EmprestimoCard
              key={emprestimo.id}
              emprestimo={emprestimo}
              onFinalize={handleFinalize}
            />
          ))}
        </div>
      )}
    </div>
  );
}
