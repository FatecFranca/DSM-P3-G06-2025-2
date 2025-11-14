"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, BookOpen, GraduationCap, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import SolicitarEmprestimoDialog from "@/components/ui/SolicitarEmprestimoDialog";

export default function LivroDetailPage() {
  const params = useParams();
  const id = params.id;

  const router = useRouter();
  const [livro, setLivro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmprestimoDialog, setShowEmprestimoDialog] = useState(false);
  const [selectedExemplar, setSelectedExemplar] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const fetchLivro = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          throw new Error("Não autorizado. Faça o login para ver os detalhes.");
        }

        const response = await fetch(`/api/livros/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Falha ao carregar informações do livro"
          );
        }

        setLivro(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLivro();
  }, [id]);

  const handleSolicitarEmprestimo = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        toast.error("Você precisa estar logado para solicitar empréstimos");
        return;
      }

      const response = await fetch(
        `/api/exemplares?livroId=${livro.id}&disponivel=true`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao buscar exemplares disponíveis");
      }

      const exemplares = await response.json();
      if (!exemplares || exemplares.length === 0) {
        toast.error("Não há exemplares disponíveis para este livro");
        return;
      }

      setSelectedExemplar({
        id: exemplares[0].id,
        num_exemplar: exemplares[0].num_exemplar,
        livro: livro,
      });
      setShowEmprestimoDialog(true);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Carregando informações do livro...
          </p>
        </div>
      </div>
    );
  }

  if (error || !livro) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Livro não encontrado
          </h2>
          <p className="text-gray-600">
            {error || "Não foi possível encontrar as informações deste livro."}
          </p>
          <Button onClick={() => router.back()}>Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
      <Button 
        variant="ghost" 
        className="mb-4 sm:mb-6 hover:bg-gray-100 transition-colors" 
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
        {/* Informações Principais */}
        <Card className="md:col-span-2 p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">{livro.titulo}</h1>
              <p className="text-base sm:text-lg text-gray-600">por {livro.autor}</p>
            </div>
            <Badge 
              variant={livro.disponibilidade ? "default" : "destructive"}
              className={livro.disponibilidade 
                ? "bg-green-50 text-green-700 border border-green-200 font-medium px-4 py-1.5" 
                : "font-medium px-4 py-1.5"
              }
            >
              {livro.disponibilidade ? "Disponível" : "Indisponível"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Editora</h3>
              <p className="text-gray-900 font-medium">{livro.editora}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Edição</h3>
              <p className="text-gray-900 font-medium">{livro.edicao}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Matéria</h3>
              <p className="text-gray-900 font-medium">{livro.materia}</p>
            </div>
            {livro.curso && (
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Curso</h3>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <p className="text-gray-900 font-medium">{livro.curso.nome}</p>
                </div>
              </div>
            )}
          </div>

          {livro.palavras_chave && livro.palavras_chave.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Palavras-chave
              </h3>
              <div className="flex flex-wrap gap-2">
                {livro.palavras_chave.map((palavra, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                  >
                    {palavra}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Card de Empréstimo */}
        <Card className="p-6 border border-gray-200 shadow-sm h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Solicitar Empréstimo</h2>

          {livro.disponibilidade ? (
            <>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Prazo de devolução</p>
                    <p className="text-sm text-blue-700">15 dias corridos</p>
                  </div>
                </div>

                {/* Checkbox de Termos */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                      Concordo com os <strong>termos da biblioteca</strong> e me comprometo a devolver o livro no prazo estabelecido.
                    </span>
                  </label>
                </div>
              </div>

              <Button 
                className="w-full font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={handleSolicitarEmprestimo}
                disabled={!acceptedTerms}
                style={{
                  backgroundColor: acceptedTerms ? "var(--primary-color)" : undefined,
                  color: acceptedTerms ? "var(--text-color-light)" : undefined,
                }}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Confirmar Empréstimo
              </Button>

              {!acceptedTerms && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  É necessário aceitar os termos para continuar
                </p>
              )}
            </>
          ) : (
            <div className="text-center space-y-3 py-6">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-900 font-medium mb-1">
                  Livro indisponível
                </p>
                <p className="text-sm text-gray-600">
                  Tente novamente mais tarde ou explore outros títulos.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {selectedExemplar && (
        <SolicitarEmprestimoDialog
          isOpen={showEmprestimoDialog}
          onClose={() => {
            setShowEmprestimoDialog(false);
            setSelectedExemplar(null);
          }}
          exemplar={selectedExemplar}
          onSuccess={() => {
            toast.success("Empréstimo realizado com sucesso!");
            router.push("/meus-emprestimos");
          }}
        />
      )}
    </div>
  );
}
