"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle } from "lucide-react";

const formatarData = (dataString) => {
  if (!dataString) {
    return "Pendente";
  }

  let data = new Date(dataString);

  if (isNaN(data.getTime())) {
    const dataCorrigida = dataString.replace(" ", "T");
    data = new Date(dataCorrigida);

    if (isNaN(data.getTime())) {
      return "Data inválida";
    }
  }

  return data.toLocaleDateString("pt-BR");
};

export default function EmprestimoCard({ emprestimo, onFinalize }) {
  const status = emprestimo.status || "ativo";

  const getStatusColor = () => {
    switch (status) {
      case "concluido":
        return "bg-green-100 text-green-800";
      case "atrasado":
        return "bg-red-100 text-red-800";
      case "ativo":
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (date) => {
    const dataObj = new Date(date);
    return dataObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="space-y-3 min-w-0 flex-1">
          <div>
            <h3 className="font-semibold text-base sm:text-lg truncate" title={emprestimo.usuario.nome}>{emprestimo.usuario.nome}</h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate" title={emprestimo.usuario.email}>{emprestimo.usuario.email}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm">Livro</h4>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2" title={emprestimo.livro?.titulo}>{emprestimo.livro?.titulo}</p>
            <p className="text-xs text-gray-500">
              Exemplar #{emprestimo.exemplar?.num_exemplar}
            </p>
          </div>

          <div className="flex gap-4">
            <div>
              <h4 className="text-sm font-medium">Retirada</h4>
              <p className="text-sm text-gray-600">
                {formatDate(emprestimo.data_emprestimo)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Devolução Prevista</h4>
              <p className="text-sm text-gray-600">
                <strong>
                  {" "}
                  {formatarData(emprestimo.data_devolucao_prevista)}
                </strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <Badge className={getStatusColor()}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>

          {(status === "ativo" || status === "atrasado") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFinalize(emprestimo.id)}
              className="flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              Finalizar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
