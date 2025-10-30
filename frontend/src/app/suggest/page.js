"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { api } from "@/app/services/api"; // Importa a API

export default function SuggestPage() {
  const [formData, setFormData] = useState({
    bookName: "",
    author: "",
    editora: "", // Campo adicionado
    course: "",
    reason: "",
  });
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega os cursos da API ao montar a página
  useEffect(() => {
    const loadCursos = async () => {
      try {
        const response = await api.cursos.listar();
        setCursos(response);
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
        toast.error("Não foi possível carregar a lista de cursos.");
      }
    };

    loadCursos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !formData.bookName ||
      !formData.author ||
      !formData.editora || // Validação adicionada
      !formData.course ||
      !formData.reason
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      setIsLoading(false);
      return;
    }

    // Mapeia os dados do formulário para o formato esperado pela API
    const sugestaoData = {
      livro_sugerido: formData.bookName,
      autor: formData.author,
      editora: formData.editora,
      curso_id: formData.course,
      motivo: formData.reason,
    };

    try {
      // Chama a API para criar a sugestão
      await api.sugestoes.criar(sugestaoData);
      toast.success("Sugestão enviada com sucesso!");

      // Reseta o formulário
      setFormData({
        bookName: "",
        author: "",
        editora: "",
        course: "",
        reason: "",
      });
    } catch (error) {
      console.error("Erro ao enviar sugestão:", error);
      toast.error("Ocorreu um erro ao enviar sua sugestão.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2
          className="text-2xl font-medium"
          style={{ color: "var(--title-color)" }}
        >
          Sugira um Livro
        </h2>
        <p className="text-gray-600">
          Ajude a expandir nossa biblioteca acadêmica sugerindo novos livros
        </p>
      </div>

      <Card className="p-8 bg-white border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book Name */}
          <div className="space-y-2">
            <Label htmlFor="bookName" style={{ color: "var(--title-color)" }}>
              Nome Do Livro *
            </Label>
            <Input
              id="bookName"
              placeholder="Nome do Livro"
              value={formData.bookName}
              onChange={(e) => handleInputChange("bookName", e.target.value)}
              className="rounded-lg border-gray-300"
              required
              disabled={isLoading}
            />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author" style={{ color: "var(--title-color)" }}>
              Autor *
            </Label>
            <Input
              id="author"
              placeholder="Autor"
              value={formData.author}
              onChange={(e) => handleInputChange("author", e.target.value)}
              className="rounded-lg border-gray-300"
              required
              disabled={isLoading}
            />
          </div>

          {/* Editora (Novo Campo) */}
          <div className="space-y-2">
            <Label htmlFor="editora" style={{ color: "var(--title-color)" }}>
              Editora *
            </Label>
            <Input
              id="editora"
              placeholder="Editora do livro"
              value={formData.editora}
              onChange={(e) => handleInputChange("editora", e.target.value)}
              className="rounded-lg border-gray-300"
              required
              disabled={isLoading}
            />
          </div>

          {/* Course */}
          <div className="space-y-2">
            <Label htmlFor="course" style={{ color: "var(--title-color)" }}>
              Curso Relacionado *
            </Label>
            <select
              id="course"
              value={formData.course}
              onChange={(e) => handleInputChange("course", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
              disabled={isLoading || cursos.length === 0}
            >
              <option value="">Selecione um curso</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" style={{ color: "var(--title-color)" }}>
              Porque este livro é importante? *
            </Label>
            <Textarea
              id="reason"
              placeholder="Descreva por que este livro seria uma boa adição à biblioteca..."
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              className="rounded-lg border-gray-300 min-h-[120px] resize-none"
              required
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-3 rounded-lg"
              style={{
                backgroundColor: "var(--primary-color)",
                color: "var(--text-color-light)",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Sugestão"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
