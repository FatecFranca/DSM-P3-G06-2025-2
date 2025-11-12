"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ArrowLeft, Search, X } from "lucide-react";
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

export default function AdminUsuariosPage() {
  const router = useRouter();
  const { user } = useApp();
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "usuario",
    curso_id: "",
  });
  const [cursos, setCursos] = useState([]);

  const [filtroInputs, setFiltroInputs] = useState({
    nome: "",
    email: "",
    perfil: "",
    curso_id: "",
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

        const filtrosLimpos = {};
        Object.entries(filtrosAplicados).forEach(([key, value]) => {
          if (value) {
            filtrosLimpos[key] = value;
          }
        });

        const [usuariosData, cursosData] = await Promise.all([
          api.usuarios.listar(filtrosLimpos),
          api.cursos.listar(),
        ]);
        setUsuarios(usuariosData);
        setCursos(cursosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, [user, router, filtrosAplicados]);

  const handleOpenDialog = (userData = null) => {
    if (userData) {
      setFormData({
        nome: userData.nome,
        email: userData.email,
        senha: "",
        perfil: userData.perfil,
        curso_id: userData.curso_id || "",
      });
      setSelectedUser(userData);
    } else {
      setFormData({
        nome: "",
        email: "",
        senha: "",
        perfil: "usuario",
        curso_id: "",
      });
      setSelectedUser(null);
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedUser(null);
    setFormData({
      nome: "",
      email: "",
      senha: "",
      perfil: "usuario",
      curso_id: "",
    });
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
    setFiltroInputs({ nome: "", email: "", perfil: "", curso_id: "" });
    setFiltrosAplicados({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        const dadosAtualizacao = { ...formData };
        if (!dadosAtualizacao.senha) {
          delete dadosAtualizacao.senha;
        }

        await api.usuarios.atualizar(selectedUser.id, dadosAtualizacao);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await api.usuarios.criar(formData);
        toast.success("Usuário criado com sucesso!");
      }

      const usuariosAtualizados = await api.usuarios.listar(filtrosAplicados);
      setUsuarios(usuariosAtualizados);
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      toast.error(error.message || "Erro ao salvar usuário");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) {
      return;
    }

    try {
      await api.usuarios.excluir(userId);
      toast.success("Usuário excluído com sucesso!");
      setUsuarios(usuarios.filter((u) => u.id !== userId));
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error(error.message || "Erro ao excluir usuário");
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
          <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
          <Button
            onClick={() => handleOpenDialog()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Usuário
          </Button>
        </div>
      </div>

      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              name="nome"
              value={filtroInputs.nome}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-md"
              placeholder="Buscar por nome..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="text"
              name="email"
              value={filtroInputs.email}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-md"
              placeholder="Buscar por email..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Perfil</label>
            <select
              name="perfil"
              value={filtroInputs.perfil}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Todos os Perfis</option>
              <option value="usuario">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Curso</label>
            <select
              name="curso_id"
              value={filtroInputs.curso_id}
              onChange={handleFiltroChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Todos os Cursos</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome}
                </option>
              ))}
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
        <div className="text-center py-12">Carregando usuários...</div>
      ) : usuarios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuarios.map((usuario) => (
            <Card key={usuario.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{usuario.nome}</h3>
                  <p className="text-sm text-gray-600">{usuario.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(usuario)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(usuario.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Perfil:</span>{" "}
                  {usuario.perfil === "admin" ? "Administrador" : "Usuário"}
                </p>
                {usuario.curso && (
                  <p className="text-sm">
                    <span className="font-medium">Curso:</span>{" "}
                    {usuario.curso.nome}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Nenhum usuário encontrado com estes filtros.
          </p>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Editar Usuário" : "Adicionar Usuário"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
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
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Senha {selectedUser && "(deixe em branco para manter a atual)"}
              </label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                {...(!selectedUser && { required: true })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Perfil</label>
              <select
                name="perfil"
                value={formData.perfil}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="usuario">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Curso</label>
              <select
                name="curso_id"
                value={formData.curso_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Selecione um curso</option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nome}
                  </option>
                ))}
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
              <Button type="submit">{selectedUser ? "Salvar" : "Criar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
