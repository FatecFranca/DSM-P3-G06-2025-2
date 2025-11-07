"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { api } from "@/app/services/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { toast } from "sonner";

export default function AdminCursosPage() {
  const router = useRouter();
  const { user } = useApp();
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    const carregarCursos = async () => {
      try {
        setIsLoading(true);
        const cursosData = await api.cursos.listar();
        setCursos(cursosData);
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
        toast.error("Erro ao carregar cursos");
      } finally {
        setIsLoading(false);
      }
    };

    carregarCursos();
  }, [user, router]);

  const handleOpenDialog = (cursoData = null) => {
    if (cursoData) {
      setFormData({
        nome: cursoData.nome,
        descricao: cursoData.descricao,
      });
      setSelectedCurso(cursoData);
    } else {
      setFormData({
        nome: "",
        descricao: "",
      });
      setSelectedCurso(null);
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedCurso(null);
    setFormData({ nome: "", descricao: "" });
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
    try {
      if (selectedCurso) {
        await api.cursos.atualizar(selectedCurso.id, formData);
        toast.success("Curso atualizado com sucesso!");
      } else {
        await api.cursos.criar(formData);
        toast.success("Curso criado com sucesso!");
      }

      // Recarregar lista de cursos
      const cursosAtualizados = await api.cursos.listar();
      setCursos(cursosAtualizados);
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
      toast.error(error.message || "Erro ao salvar curso");
    }
  };

  const handleDelete = async (cursoId) => {
    if (!window.confirm("Tem certeza que deseja excluir este curso?")) {
      return;
    }

    try {
      await api.cursos.excluir(cursoId);
      toast.success("Curso excluído com sucesso!");
      setCursos(cursos.filter((c) => c.id !== cursoId));
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
      toast.error("Erro ao excluir curso");
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
          <h1 className="text-3xl font-bold">Gerenciar Cursos</h1>
          <Button
            onClick={() => handleOpenDialog()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Curso
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursos.map((curso) => (
          <Card key={curso.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{curso.nome}</h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenDialog(curso)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(curso.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{curso.descricao}</p>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCurso ? "Editar Curso" : "Adicionar Curso"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nome do Curso
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                rows={4}
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
              <Button type="submit">
                {selectedCurso ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
