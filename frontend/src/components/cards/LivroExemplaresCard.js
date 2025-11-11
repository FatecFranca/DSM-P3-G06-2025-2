"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

export default function LivroExemplaresCard({
  livro,
  quantidade,
  onAdd,
  onRemove,
}) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg">{livro.titulo}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Quantidade de exemplares: {quantidade}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAdd}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
          {quantidade > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Remover
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
