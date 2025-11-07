import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle } from "lucide-react";

export default function EmprestimoCard({ emprestimo, onFinalize }) {
  const status = emprestimo.data_devolucao
    ? "devolvido"
    : new Date(emprestimo.data_prevista) < new Date()
    ? "atrasado"
    : "ativo";

  const getStatusColor = () => {
    switch (status) {
      case "devolvido":
        return "bg-green-100 text-green-800";
      case "atrasado":
        return "bg-red-100 text-red-800";
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
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{emprestimo.usuario.nome}</h3>
            <p className="text-sm text-gray-600">{emprestimo.usuario.email}</p>
          </div>

          <div>
            <h4 className="font-medium">Livro</h4>
            <p className="text-sm text-gray-600">
              {emprestimo.exemplar.livro.titulo}
            </p>
            <p className="text-xs text-gray-500">
              Exemplar #{emprestimo.exemplar.num_exemplar}
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
                {formatDate(emprestimo.data_prevista)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <Badge className={getStatusColor()}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>

          {status === "ativo" && (
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
