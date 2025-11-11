"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import SugestaoCard from "@/components/cards/SugestaoCard";
import { api } from "@/app/services/api";
import { toast } from "sonner";

export default function AdminSugestoesPage() {
  const router = useRouter();
  const { user } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [sugestoes, setSugestoes] = useState([]);

  // Carregar sugestões
  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    const carregarSugestoes = async () => {
      try {
        setIsLoading(true);
        const data = await api.sugestoes.listar({ status: "pendente" });
        setSugestoes(data);
      } catch (error) {
        console.error("Erro ao carregar sugestões:", error);
        toast.error("Erro ao carregar sugestões");
      } finally {
        setIsLoading(false);
      }
    };

    carregarSugestoes();
  }, [user, router]);

  const handleAprovar = async (sugestao) => {
    try {
      await api.sugestoes.atualizar(sugestao.id, { status: "aprovada" });
      toast.success("Sugestão aprovada! Redirecionando para criar o livro...");

      setSugestoes(sugestoes.filter((s) => s.id !== sugestao.id));

      const queryParams = new URLSearchParams();
      if (sugestao.livro_sugerido)
        queryParams.append("titulo", sugestao.livro_sugerido);
      if (sugestao.autor) queryParams.append("autor", sugestao.autor);
      if (sugestao.editora) queryParams.append("editora", sugestao.editora);

      router.push(`/admin/livros?${queryParams.toString()}`);
    } catch (error) {
      console.error("Erro ao aprovar sugestão:", error);
      toast.error(error.message || "Erro ao aprovar sugestão");
    }
  };

  const handleRejeitar = async (id) => {
    if (!window.confirm("Tem certeza que deseja rejeitar esta sugestão?")) {
      return;
    }

    try {
      await api.sugestoes.atualizar(id, { status: "rejeitada" });
      toast.success("Sugestão rejeitada com sucesso!");

      const sugestoesAtualizadas = sugestoes.filter((s) => s.id !== id);
      setSugestoes(sugestoesAtualizadas);
    } catch (error) {
      console.error("Erro ao rejeitar sugestão:", error);
      toast.error(error.message || "Erro ao rejeitar sugestão");
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
          <h1 className="text-3xl font-bold">Sugestões de Livros</h1>
        </div>
      </div>

      {sugestoes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma sugestão de livro pendente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sugestoes.map((sugestao) => (
            <SugestaoCard
              key={sugestao.id}
              sugestao={sugestao}
              onAprovar={() => handleAprovar(sugestao)}
              onRejeitar={() => handleRejeitar(sugestao.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
