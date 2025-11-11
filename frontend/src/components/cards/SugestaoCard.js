"use' client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Check, X } from "lucide-react";

export default function SugestaoCard({ sugestao, onAprovar, onRejeitar }) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        {/* Informações do Livro */}
        <div className="space-y-2">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Livro Sugerido
            </h4>
            <h3 className="font-semibold text-lg">{sugestao.livro_sugerido}</h3>
            <p className="text-sm text-gray-600">
              Autor: {sugestao.autor || "Não informado"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">ISBN</h4>
              <p className="text-sm text-gray-600">
                {sugestao.isbn || "Não informado"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Editora</h4>
              <p className="text-sm text-gray-600">
                {sugestao.editora || "Não informada"}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium">Edição</h4>
            <p className="text-sm text-gray-600">
              {sugestao.edicao || "Não informada"}
            </p>
          </div>

          {sugestao.ano_publicacao && (
            <div>
              <h4 className="text-sm font-medium">Ano de Publicação</h4>
              <p className="text-sm text-gray-600">{sugestao.ano_publicacao}</p>
            </div>
          )}
        </div>

        {/* Informações do Usuário */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-sm mb-1">Sugerido por</h4>
          <p className="text-sm text-gray-600">{sugestao.usuario.nome}</p>
          <p className="text-sm text-gray-500">{sugestao.usuario.email}</p>
        </div>

        {/* Justificativa/Descrição */}
        {sugestao.descricao && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-1">Justificativa</h4>
            <p className="text-sm text-gray-600">{sugestao.descricao}</p>
          </div>
        )}

        {/* Data da Sugestão */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-sm mb-1">Data da sugestão</h4>
          <p className="text-sm text-gray-600">
            {new Date(sugestao.data_sugestao).toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-2 border-t pt-4">
          <Button
            onClick={() => onAprovar(sugestao.id)}
            variant="outline"
            className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:border-green-600"
          >
            <Check className="h-4 w-4" />
            Aprovar
          </Button>
          <Button
            onClick={() => onRejeitar(sugestao.id)}
            variant="outline"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-600"
          >
            <X className="h-4 w-4" />
            Rejeitar
          </Button>
        </div>
      </div>
    </Card>
  );
}
