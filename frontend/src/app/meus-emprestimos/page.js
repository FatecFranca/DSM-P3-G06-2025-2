"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Calendar, BookOpen, AlertCircle, Clock, Info } from "lucide-react";

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
}

function getStatusColor(status) {
  switch (status) {
    case "ativo":
      return "bg-green-50 text-green-700 border border-green-200";
    case "atrasado":
      return "bg-red-50 text-red-700 border border-red-200";
    case "concluido":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Meus Empréstimos</h1>
          <Link href="/courses">
            <Button 
              variant="outline" 
              className="gap-2 rounded-lg hover:bg-gray-50 transition-all border-gray-200 font-medium"
            >
              <BookOpen className="h-4 w-4" />
              Explorar Livros
            </Button>
          </Link>
        </div>
        <p className="text-gray-600">
          Acompanhe seus empréstimos ativos e histórico de leituras
        </p>
      </div>

      {emprestimos.length === 0 ? (
        <Card className="p-12 text-center border border-gray-200 shadow-sm">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            Nenhum empréstimo encontrado
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Você ainda não tem empréstimos. Explore nosso acervo e comece sua jornada de leitura!
          </p>
          <Link href="/courses">
            <Button 
              className="font-medium shadow-sm hover:shadow-md transition-all"
              style={{
                backgroundColor: "var(--primary-color)",
                color: "var(--text-color-light)",
              }}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Ver Catálogo de Livros
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {emprestimos.map((emprestimo) => {
            const isAtrasado = new Date(emprestimo.data_devolucao_prevista) < new Date() && emprestimo.status === "ativo";
            const diasRestantes = Math.ceil(
              (new Date(emprestimo.data_devolucao_prevista) - new Date()) / (1000 * 60 * 60 * 24)
            );

            return (
              <Card 
                key={emprestimo.id} 
                className={`p-6 border shadow-sm hover:shadow-md transition-all ${
                  isAtrasado ? 'border-red-200 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {emprestimo.livro.titulo}
                    </h3>
                    <p className="text-gray-600">por {emprestimo.livro.autor}</p>
                  </div>
                  <Badge 
                    className={`${getStatusColor(emprestimo.status)} font-medium px-4 py-1.5 shadow-sm`}
                  >
                    {emprestimo.status === 'ativo' ? 'Ativo' : 
                     emprestimo.status === 'atrasado' ? 'Atrasado' : 
                     emprestimo.status === 'concluido' ? 'Concluído' : 
                     emprestimo.status.charAt(0).toUpperCase() + emprestimo.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Data de Empréstimo
                      </p>
                      <p className="text-gray-900 font-medium">
                        {formatDate(emprestimo.data_emprestimo)}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 p-3 rounded-lg border ${
                    isAtrasado 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-blue-50 border-blue-100'
                  }`}>
                    <Calendar className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                      isAtrasado ? 'text-red-600' : 'text-blue-600'
                    }`} />
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                        isAtrasado ? 'text-red-700' : 'text-blue-700'
                      }`}>
                        Devolução Prevista
                      </p>
                      <p className={`font-medium ${
                        isAtrasado ? 'text-red-900' : 'text-blue-900'
                      }`}>
                        {formatDate(emprestimo.data_devolucao_prevista)}
                      </p>
                    </div>
                  </div>
                </div>

                {emprestimo.status === "ativo" && (
                  <div className={`p-4 rounded-lg border ${
                    isAtrasado 
                      ? 'bg-red-100 border-red-300 flex items-start gap-3' 
                      : diasRestantes <= 3
                      ? 'bg-yellow-50 border-yellow-200 flex items-start gap-3'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    {isAtrasado ? (
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : diasRestantes <= 3 ? (
                      <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    ) : null}
                    <p className={`text-sm font-medium ${
                      isAtrasado 
                        ? 'text-red-900' 
                        : diasRestantes <= 3
                        ? 'text-yellow-900'
                        : 'text-gray-700'
                    }`}>
                      {isAtrasado 
                        ? 'Atenção: Este empréstimo está atrasado! Por favor, devolva o livro o quanto antes.' 
                        : diasRestantes <= 3
                        ? `Atenção: Restam apenas ${diasRestantes} ${diasRestantes === 1 ? 'dia' : 'dias'} para devolução!`
                        : `Prazo de devolução: ${diasRestantes} ${diasRestantes === 1 ? 'dia' : 'dias'} restantes`
                      }
                    </p>
                  </div>
                )}

                {emprestimo.status === "concluido" && emprestimo.data_devolucao && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Devolvido em:</span>{" "}
                      {formatDate(emprestimo.data_devolucao)}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
