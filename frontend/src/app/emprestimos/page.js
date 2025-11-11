"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("pt-BR");
};

const getStatusColor = (status) => {
  switch (status) {
    case "ativo":
      return "bg-green-100 text-green-800";
    case "concluido":
      return "bg-blue-100 text-blue-800";
    case "atrasado":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmprestimos = async () => {
      try {
        const response = await fetch("/api/emprestimos/meusEmprestimos", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Falha ao carregar empréstimos");
        }

        const data = await response.json();
        setEmprestimos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmprestimos();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Meus Empréstimos</h1>

      {emprestimos.length === 0 ? (
        <div className="text-center py-8">
          <p>Você ainda não possui nenhum empréstimo.</p>
          <Button className="mt-4" onClick={() => (window.location.href = "/")}>
            Explorar Livros
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {emprestimos.map((emprestimo) => (
            <Card key={emprestimo.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {emprestimo.livro.titulo}
                  </h3>
                  <p className="text-gray-600">{emprestimo.livro.autor}</p>
                  <p className="text-sm mt-2">
                    Exemplar: {emprestimo.exemplar.num_exemplar}
                  </p>
                </div>
                <Badge className={getStatusColor(emprestimo.status)}>
                  {emprestimo.status.charAt(0).toUpperCase() +
                    emprestimo.status.slice(1)}
                </Badge>
              </div>

              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Data do Empréstimo</p>
                  <p>{formatDate(emprestimo.data_emprestimo)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Devolução Prevista</p>
                  <p>{formatDate(emprestimo.data_devolucao_prevista)}</p>
                </div>
                {emprestimo.data_devolucao_real && (
                  <div className="col-span-2">
                    <p className="text-gray-600">Devolvido em</p>
                    <p>{formatDate(emprestimo.data_devolucao_real)}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
