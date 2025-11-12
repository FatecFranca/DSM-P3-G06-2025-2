"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { Plus, ArrowLeft, Search, X } from "lucide-react";
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
import { Card } from "@/components/ui/Card";

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

  const [filtroInputs, setFiltroInputs] = useState({
    titulo: "",
    disponivel: "",
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState({});

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    const carregarDados = async () => {
      try {
        setIsLoading(true);

        const filtrosLivros = {};
        if (filtrosAplicados.titulo) {
          filtrosLivros.titulo = filtrosAplicados.titulo;
        }

        const filtrosExemplares = {};
        if (filtrosAplicados.disponivel) {
          filtrosExemplares.disponivel = filtrosAplicados.disponivel;
        }

        const [exemplaresData, livrosData] = await Promise.all([
          api.exemplares.listar(filtrosExemplares),
          api.livros.listar(filtrosLivros),
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
  }, [user, router, filtrosAplicados]);

  const exemplaresPorLivro = exemplares.reduce((acc, exemplar) => {
    const livroId = exemplar.id_livro || exemplar.livro?.id;
    if (livroId) {
      acc[livroId] = (acc[livroId] || 0) + 1;
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
    setFiltroInputs({ titulo: "", disponivel: "" });
    setFiltrosAplicados({});
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
        num_exemplar: formData.num_exemplar,
      };

      await api.exemplares.criar(dadosParaEnviar);
      toast.success("Exemplar criado com sucesso!");

      const exemplaresAtualizados = await api.exemplares.listar(
        filtrosAplicados
      );
      setExemplares(exemplaresAtualizados);
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao salvar exemplar:", error);
      toast.error(error.message || "Erro ao salvar exemplar");
    }
  };

  const handleDelete = async (livroId) => {
    const exemplaresDesseLivro = exemplares.filter(
      (e) => (e.id_livro || e.livro?.id) === livroId
    );
    if (exemplaresDesseLivro.length === 0) {
      toast.error("Este livro não possui exemplares (filtrados) para remover.");
      return;
    }

    const ultimoExemplar = exemplaresDesseLivro.sort(
      (a, b) => b.num_exemplar - a.num_exemplar
    )[0];

    if (
      !window.confirm(
        `Tem certeza que deseja remover o exemplar nº ${ultimoExemplar.num_exemplar} deste livro?`
      )
    ) {
      return;
    }

    try {
      await api.exemplares.excluir(ultimoExemplar.id);
      toast.success("Exemplar removido com sucesso!");

      const exemplaresAtualizados = await api.exemplares.listar(
        filtrosAplicados
      );
      setExemplares(exemplaresAtualizados);
    } catch (error) {
      console.error("Erro ao excluir exemplar:", error);
      toast.error(error.message || "Erro ao remover exemplar");
    }
  };

  if (isLoading && !showDialog) {
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
        </div>
      </div>

      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Título do Livro
            </label>
            <input
              type="text"
              name="titulo"
              value={filtroInputs.titulo}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-md"
              placeholder="Filtrar livros por título..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Status do Exemplar
            </label>
            <select
              name="disponivel"
              value={filtroInputs.disponivel}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Todos</option>
              <option value="true">Apenas Disponíveis</option>
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
        <div className="text-center py-12">Carregando...</div>
      ) : livros.length > 0 ? (
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
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Nenhum livro encontrado com este filtro.
          </p>
        </div>
      )}

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
