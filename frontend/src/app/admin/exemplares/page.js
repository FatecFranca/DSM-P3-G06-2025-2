"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import LivroExemplaresCard from "@/components/cards/LivroExemplaresCard";
import { api } from "@/app/services/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";

export default function AdminExemplaresPage() {
  const router = useRouter();
  const { user } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [exemplares, setExemplares] = useState([]);
  const [livros, setLivros] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedLivro, setSelectedLivro] = useState(null);
  const [formData, setFormData] = useState({
    num_exemplar: "",
  });

  // Carregar exemplares e livros
  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    const carregarDados = async () => {
      try {
        setIsLoading(true);
        const [exemplaresData, livrosData] = await Promise.all([
          api.exemplares.listar(),
          api.livros.listar(),
        ]);

        setExemplares(exemplaresData);
        setLivros(livrosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, [user, router]);

  // Contagem de exemplares por livro
  const exemplaresPorLivro = exemplares.reduce((acc, exemplar) => {
    if (exemplar.id_livro) {
      acc[exemplar.id_livro] = (acc[exemplar.id_livro] || 0) + 1;
    }
    return acc;
  }, {});

  const handleOpenDialog = (livro) => {
    setSelectedLivro(livro);
    setFormData({ num_exemplar: "" });
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedLivro(null);
    setFormData({ num_exemplar: "" });
    setShowDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLivro) {
      toast.error("Por favor, selecione um livro");
      return;
    }

    try {
      const dadosParaEnviar = {
        id_livro: selectedLivro.id,
        num_exemplar: parseInt(formData.num_exemplar, 10),
      };

      await api.exemplares.criar(dadosParaEnviar);
      toast.success("Exemplar criado com sucesso!");

      // Recarregar lista de exemplares
      const exemplaresAtualizados = await api.exemplares.listar();
      setExemplares(exemplaresAtualizados);
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao salvar exemplar:", error);
      toast.error(error.message || "Erro ao salvar exemplar");
    }
  };

  const handleDelete = async (livroId) => {
    // Encontrar o exemplar mais recente deste livro
    const exemplaresDesseLivro = exemplares.filter(
      (e) => e.id_livro === livroId
    );
    if (exemplaresDesseLivro.length === 0) return;

    // Ordenar por número do exemplar em ordem decrescente
    const ultimoExemplar = exemplaresDesseLivro.sort(
      (a, b) => b.num_exemplar - a.num_exemplar
    )[0];

    if (
      !window.confirm("Tem certeza que deseja remover um exemplar deste livro?")
    ) {
      return;
    }

    try {
      await api.exemplares.excluir(ultimoExemplar.id);
      toast.success("Exemplar removido com sucesso!");

      // Atualizar a lista de exemplares
      const exemplaresAtualizados = exemplares.filter(
        (e) => e.id !== ultimoExemplar.id
      );
      setExemplares(exemplaresAtualizados);
    } catch (error) {
      console.error("Erro ao excluir exemplar:", error);
      toast.error("Erro ao remover exemplar");
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
          <h1 className="text-3xl font-bold">Gerenciar Exemplares</h1>
          <Button
            onClick={() => handleOpenDialog()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Exemplar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {livros.map((livro) => (
          <LivroExemplaresCard
            key={livro.id}
            livro={livro}
            quantidade={exemplaresPorLivro[livro.id] || 0}
            onAdd={() => handleOpenDialog(livro)}
            onRemove={() => handleDelete(livro.id)}
          />
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Adicionar Exemplar - {selectedLivro?.titulo}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Número do Exemplar
              </label>
              <input
                type="number"
                name="num_exemplar"
                value={formData.num_exemplar}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                min="1"
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancelar
              </Button>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
