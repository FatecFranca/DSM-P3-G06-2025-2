"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { toast } from "sonner";

export default function SuggestPage() {
  const [formData, setFormData] = useState({
    bookName: "",
    author: "",
    course: "",
    reason: ""
  });

  const courses = [
    { value: "dsm", label: "DSM - Desenvolvimento de Software Multiplataforma" },
    { value: "ads", label: "ADS - Análise e Desenvolvimento de Sistemas" },
    { value: "gpi", label: "GPI - Gestão da Produção Industrial" },
    { value: "grh", label: "GRH - Gestão de Recursos Humanos" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.bookName || !formData.author || !formData.course || !formData.reason) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    toast.success("Sugestão enviada com sucesso!");
    
    // Reset form
    setFormData({
      bookName: "",
      author: "",
      course: "",
      reason: ""
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-medium" style={{ color: 'var(--title-color)' }}>
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
            <Label htmlFor="bookName" style={{ color: 'var(--title-color)' }}>
              Nome Do Livro *
            </Label>
            <Input
              id="bookName"
              placeholder="Nome do Livro"
              value={formData.bookName}
              onChange={(e) => handleInputChange("bookName", e.target.value)}
              className="rounded-lg border-gray-300"
              required
            />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author" style={{ color: 'var(--title-color)' }}>
              Autor *
            </Label>
            <Input
              id="author"
              placeholder="Autor"
              value={formData.author}
              onChange={(e) => handleInputChange("author", e.target.value)}
              className="rounded-lg border-gray-300"
              required
            />
          </div>

          {/* Course */}
          <div className="space-y-2">
            <Label htmlFor="course" style={{ color: 'var(--title-color)' }}>
              Curso Relacionado *
            </Label>
            <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
              <SelectTrigger className="rounded-lg border-gray-300">
                <SelectValue placeholder="Selecione um curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.value} value={course.value}>
                    {course.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" style={{ color: 'var(--title-color)' }}>
              Porque este livro é importante? *
            </Label>
            <Textarea
              id="reason"
              placeholder="Descreva por que este livro seria uma boa adição à biblioteca..."
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              className="rounded-lg border-gray-300 min-h-[120px] resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full py-3 rounded-lg"
              style={{ 
                backgroundColor: 'var(--primary-color)',
                color: 'var(--text-color-light)'
              }}
            >
              Enviar Sugestão
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
