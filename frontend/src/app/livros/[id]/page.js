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
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Informações Principais */}
        <Card className="md:col-span-2 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{livro.titulo}</h1>
              <p className="text-lg text-gray-600">{livro.autor}</p>
            </div>
            <Badge variant={livro.disponibilidade ? "success" : "destructive"}>
              {livro.disponibilidade ? "Disponível" : "Indisponível"}
            </Badge>
          </div>

          <div className="grid gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Editora</h3>
              <p>{livro.editora}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Edição</h3>
              <p>{livro.edicao}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Matéria</h3>
              <p>{livro.materia}</p>
            </div>
            {livro.curso && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Curso</h3>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-gray-400" />
                  <p>{livro.curso.nome}</p>
                </div>
              </div>
            )}
          </div>

          {livro.palavras_chave && livro.palavras_chave.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Palavras-chave
              </h3>
              <div className="flex flex-wrap gap-2">
                {livro.palavras_chave.map((palavra, index) => (
                  <Badge key={index} variant="secondary">
                    {palavra}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Card de Empréstimo */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Solicitar Empréstimo</h2>

          {livro.disponibilidade ? (
            <>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Prazo de devolução: 15 dias
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Ao solicitar o empréstimo, você concorda com os termos da
                  biblioteca.
                </p>
              </div>

              <Button className="w-full" onClick={handleSolicitarEmprestimo}>
                Solicitar Empréstimo
              </Button>
            </>
          ) : (
            <div className="text-center space-y-2">
              <BookOpen className="h-8 w-8 mx-auto text-gray-400" />
              <p className="text-gray-600">
                Este livro não está disponível no momento.
              </p>
              <p className="text-sm text-gray-500">
                Tente novamente mais tarde ou explore outros títulos.
              </p>
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
