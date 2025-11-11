"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { solicitarEmprestimo } from "@/lib/emprestimos";

export default function SolicitarEmprestimoDialog({
  isOpen,
  onClose,
  exemplar,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dataDevolucaoPrevista = new Date();
  dataDevolucaoPrevista.setDate(dataDevolucaoPrevista.getDate() + 15);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await solicitarEmprestimo(
        exemplar.id,
        dataDevolucaoPrevista.toISOString()
      );
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} title="Solicitar Empréstimo">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          Confirmar Solicitação de Empréstimo
        </h3>

        {exemplar && (
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Livro</p>
              <p className="font-medium">{exemplar.livro.titulo}</p>
              <p className="text-sm text-gray-500">
                Exemplar nº {exemplar.num_exemplar}
              </p>
            </div>

            <div>
              <p className="text-gray-600">Data do Empréstimo</p>
              <p className="font-medium">
                {new Date().toLocaleDateString("pt-BR")}
              </p>
            </div>

            <div>
              <p className="text-gray-600">Data de Devolução Prevista</p>
              <p className="font-medium">
                {dataDevolucaoPrevista.toLocaleDateString("pt-BR")}
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                Ao solicitar o empréstimo, você concorda com os seguintes
                termos:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>O prazo de devolução é de 15 dias corridos</li>
                <li>Você pode ter no máximo 3 empréstimos ativos</li>
                <li>
                  Em caso de atraso, novos empréstimos podem ser bloqueados
                </li>
              </ul>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Processando..." : "Confirmar Empréstimo"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
