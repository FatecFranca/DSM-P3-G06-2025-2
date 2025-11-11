"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Calendar, BookOpen } from "lucide-react";

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
}

function getStatusColor(status) {
  switch (status) {
    case "ativo":
      return "bg-green-100 text-green-800";
    case "atrasado":
      return "bg-red-100 text-red-800";
    case "concluido":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function MeusEmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmprestimos = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          setError("Você precisa estar logado para ver seus empréstimos");
          return;
        }

        const response = await fetch("/api/emprestimos?meus=true", {
          headers: {
            "Authorization": `Bearer ${token}`,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando seus empréstimos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Empréstimos</h1>
        <Link href="/courses">
          <Button variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Explorar Livros
          </Button>
        </Link>
      </div>

      {emprestimos.length === 0 ? (
        <Card className="p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Você ainda não tem empréstimos
          </h3>
          <p className="text-gray-600 mb-6">
            Explore nosso acervo e solicite seu próximo empréstimo.
          </p>
          <Link href="/courses">
            <Button>Ver Catálogo de Livros</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {emprestimos.map((emprestimo) => (
            <Card key={emprestimo.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {emprestimo.livro.titulo}
                  </h3>
                  <p className="text-gray-600">{emprestimo.livro.autor}</p>
                </div>
                <Badge className={getStatusColor(emprestimo.status)}>
                  {emprestimo.status.charAt(0).toUpperCase() +
                    emprestimo.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Emprestado em</p>
                    <p className="font-medium">
                      {formatDate(emprestimo.data_emprestimo)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Devolução prevista</p>
                    <p className="font-medium">
                      {formatDate(emprestimo.data_devolucao_prevista)}
                    </p>
                  </div>
                </div>
              </div>

              {emprestimo.status === "ativo" && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    {new Date(emprestimo.data_devolucao_prevista) < new Date()
                      ? "Atenção: Empréstimo atrasado!"
                      : `Restam ${Math.ceil(
                          (new Date(emprestimo.data_devolucao_prevista) -
                            new Date()) /
                            (1000 * 60 * 60 * 24)
                        )} dias para devolução`}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
