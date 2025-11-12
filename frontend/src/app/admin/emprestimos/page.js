"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import EmprestimoCard from "@/components/cards/EmprestimoCard";
import { api } from "@/app/services/api";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";

export default function AdminEmprestimosPage() {
  const router = useRouter();
  const { user } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [emprestimos, setEmprestimos] = useState([]);

  const [filtroInputs, setFiltroInputs] = useState({
    userName: "",
    bookTitle: "",
    status: "",
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState({});

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    const carregarEmprestimos = async () => {
      try {
        setIsLoading(true);

        const filtrosLimpos = {};
        Object.entries(filtrosAplicados).forEach(([key, value]) => {
          if (value) {
            filtrosLimpos[key] = value;
          }
        });

        const data = await api.emprestimos.listar(filtrosLimpos);
        setEmprestimos(data);
      } catch (error) {
        console.error("Erro ao carregar empréstimos:", error);
        toast.error("Erro ao carregar empréstimos");
      } finally {
        setIsLoading(false);
      }
    };

    carregarEmprestimos();
  }, [user, router, filtrosAplicados]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltroInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAplicarFiltros = () => {
    setFiltrosAplicados(filtroInputs);
  };

  const handleLimparFiltros = () => {
    setFiltroInputs({ userName: "", bookTitle: "", status: "" });
    setFiltrosAplicados({});
  };

  const handleFinalize = async (id) => {
    if (!window.confirm("Tem certeza que deseja finalizar este empréstimo?")) {
      return;
    }

    try {
      await api.emprestimos.atualizar(id, { status: "concluido" });
      toast.success("Empréstimo finalizado com sucesso!");

      const emprestimosAtualizados = await api.emprestimos.listar(
        filtrosAplicados
      );
      setEmprestimos(emprestimosAtualizados);
    } catch (error) {
      console.error("Erro ao finalizar empréstimo:", error);
      toast.error(error.message || "Erro ao finalizar empréstimo");
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

      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do Usuário
            </label>
            <input
              type="text"
              name="userName"
              value={filtroInputs.userName}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-md"
              placeholder="Buscar por usuário..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Título do Livro
            </label>
            <input
              type="text"
              name="bookTitle"
              value={filtroInputs.bookTitle}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-md"
              placeholder="Buscar por título..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={filtroInputs.status}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="atrasado">Atrasado</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={handleLimparFiltros}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpar
          </Button>
          <Button
            onClick={handleAplicarFiltros}
            size="sm"
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Filtrar
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">Carregando empréstimos...</div>
      ) : emprestimos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Nenhum empréstimo encontrado com estes filtros.
          </p>
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
