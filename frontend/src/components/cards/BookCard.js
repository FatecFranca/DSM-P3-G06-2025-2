import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function BookCard({ book, onEdit, onDelete }) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">{book.titulo}</h3>
          <p className="text-sm text-gray-600">por {book.autor}</p>
        </div>
        <Badge variant={book.disponibilidade ? "success" : "destructive"}>
          {book.disponibilidade ? "Disponível" : "Indisponível"}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm">
          <span className="font-medium">Editora:</span> {book.editora}
        </p>
        <p className="text-sm">
          <span className="font-medium">Edição:</span> {book.edicao}
        </p>
        <p className="text-sm">
          <span className="font-medium">Matéria:</span> {book.materia}
        </p>
        {book.curso && (
          <p className="text-sm">
            <span className="font-medium">Curso:</span> {book.curso.nome}
          </p>
        )}
      </div>

      {book.palavras_chave && book.palavras_chave.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {book.palavras_chave.map((palavra, index) => (
            <Badge key={index} variant="secondary">
              {palavra}
            </Badge>
          ))}
        </div>
      )}

      {/* Ações administrativas */}
      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-2 mt-4 border-t pt-4">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onEdit(book);
              }}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onDelete(book.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Excluir</span>
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
