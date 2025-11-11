"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";

export default function ExemplarCard({ exemplar, onEdit, onDelete }) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">
            {exemplar.livro?.titulo || "Livro não encontrado"}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Número:</span> {exemplar.num_exemplar}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Status:</span>{" "}
            {exemplar.disponivel ? "Disponível" : "Emprestado"}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Localização:</span>{" "}
            {exemplar.localizacao}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
