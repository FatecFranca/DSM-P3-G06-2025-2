"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { Plus, ArrowLeft, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import BookCard from "@/components/cards/BookCard";
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

export default function AdminLivrosPage() {
  const router = useRouter();
  const { user } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    editora: "",
    edicao: "",
    materia: "",
    palavras_chave: [],
    disponibilidade: true,
  });

  const searchParams = useSearchParams();

  const [filtroInputs, setFiltroInputs] = useState({
    titulo: "",
    autor: "",
    materia: "",
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState({});

  useEffect(() => {
    const tituloSugerido = searchParams.get("titulo");
    const autorSugerido = searchParams.get("autor");
    const editoraSugerida = searchParams.get("editora");

    if (tituloSugerido || autorSugerido || editoraSugerida) {
      setFormData((prev) => ({
        ...prev,
        titulo: tituloSugerido || "",
        autor: autorSugerido || "",
        editora: editoraSugerida || "",
      }));

      setShowDialog(true);

      router.replace("/admin/livros", undefined, { shallow: true });
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    const carregarLivros = async () => {
      try {
        setIsLoading(true);

        const filtrosLimpos = {};
        Object.entries(filtrosAplicados).forEach(([key, value]) => {
          if (value) {
            filtrosLimpos[key] = value;
          }
        });

        const livrosData = await api.livros.listar(filtrosLimpos);
        setBooks(livrosData);
      } catch (error) {
        console.error("Erro ao carregar livros:", error);
        toast.error("Erro ao carregar livros");
      } finally {
        setIsLoading(false);
      }
    };

    carregarLivros();
  }, [user, router, filtrosAplicados]);

  const handleOpenDialog = (book = null) => {
    if (book) {
      setFormData({
        titulo: book.titulo,
        autor: book.autor,
        editora: book.editora,
        edicao: book.edicao,
        materia: book.materia,
        palavras_chave: book.palavras_chave || [],
        disponibilidade: book.disponibilidade,
      });
      setSelectedBook(book);
    } else {
      setFormData({
        titulo: "",
        autor: "",
        editora: "",
        edicao: "",
        materia: "",
        palavras_chave: [],
        disponibilidade: true,
      });
      setSelectedBook(null);
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedBook(null);
    setFormData({
      titulo: "",
      autor: "",
      editora: "",
      edicao: "",
      materia: "",
      palavras_chave: [],
      disponibilidade: true,
    });
    setShowDialog(false);
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
    setFiltroInputs({ titulo: "", autor: "", materia: "" });
    setFiltrosAplicados({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedBook) {
        await api.livros.atualizar(selectedBook.id, formData);
        toast.success("Livro atualizado com sucesso!");
      } else {
        await api.livros.criar(formData);
        toast.success("Livro criado com sucesso!");
      }

      const livrosAtualizados = await api.livros.listar(filtrosAplicados);
      setBooks(livrosAtualizados);
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao salvar livro:", error);
      toast.error(error.message || "Erro ao salvar livro");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este livro?")) {
      return;
    }

    try {
      await api.livros.excluir(id);
      toast.success("Livro excluído com sucesso!");
      setBooks(books.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Erro ao excluir livro:", error);
      toast.error(error.message || "Erro ao excluir livro");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "palavras_chave") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(",").map((word) => word.trim()),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
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
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin")}
            className="flex items-center gap-1.5 sm:gap-2 text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Voltar
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">Gerenciar Livros</h1>
          <Button
            onClick={() => handleOpenDialog()}
            className="flex items-center justify-center gap-1.5 sm:gap-2 text-sm whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Adicionar Livro</span>
            <span className="xs:hidden">Adicionar</span>
          </Button>
        </div>
      </div>

      <Card className="p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              name="titulo"
              value={filtroInputs.titulo}
              onChange={handleFiltroChange}
              className="w-full p-2 text-sm border rounded-md"
              placeholder="Buscar por título..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Autor</label>
            <input
              type="text"
              name="autor"
              value={filtroInputs.autor}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-md"
              placeholder="Buscar por autor..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Matéria</label>
            <input
              type="text"
              name="materia"
              value={filtroInputs.materia}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-md"
              placeholder="Buscar por matéria..."
            />
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
        <div className="text-center py-12">Carregando livros...</div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={() => handleOpenDialog(book)}
              onDelete={() => handleDelete(book.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Nenhum livro encontrado com estes filtros.
          </p>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedBook ? "Editar Livro" : "Adicionar Livro"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Autor</label>
              <input
                type="text"
                name="autor"
                value={formData.autor}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Editora</label>
              <input
                type="text"
                name="editora"
                value={formData.editora}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Edição</label>
              <input
                type="text"
                name="edicao"
                value={formData.edicao}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Matéria</label>
              <input
                type="text"
                name="materia"
                value={formData.materia}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Palavras-chave
              </label>
              <input
                type="text"
                name="palavras_chave"
                value={formData.palavras_chave.join(", ")}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Separe as palavras-chave por vírgula"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Disponibilidade
              </label>
              <select
                name="disponibilidade"
                value={formData.disponibilidade.toString()}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="true">Disponível</option>
                <option value="false">Indisponível</option>
              </select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancelar
              </Button>
              <Button type="submit">{selectedBook ? "Salvar" : "Criar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
