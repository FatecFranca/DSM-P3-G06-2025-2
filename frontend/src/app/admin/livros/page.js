"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { Plus, ArrowLeft } from "lucide-react";
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

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    const carregarLivros = async () => {
      try {
        setIsLoading(true);
        const livrosData = await api.livros.listar();
        setBooks(livrosData);
      } catch (error) {
        console.error("Erro ao carregar livros:", error);
        toast.error("Erro ao carregar livros");
      } finally {
        setIsLoading(false);
      }
    };

    carregarLivros();
  }, [user, router]);

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

      // Recarregar lista de livros
      const livrosAtualizados = await api.livros.listar();
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
      toast.error("Erro ao excluir livro");
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
          <h1 className="text-3xl font-bold">Gerenciar Livros</h1>
          <Button
            onClick={() => handleOpenDialog()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Livro
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={() => handleOpenDialog(book)}
            onDelete={() => handleDelete(book.id)}
          />
        ))}
      </div>

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
