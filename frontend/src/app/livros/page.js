"use client";

import { useEffect, useState } from "react";
import BookCard from "@/components/cards/BookCard";
import SolicitarEmprestimoDialog from "@/components/ui/SolicitarEmprestimoDialog";

export default function LivrosPage() {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExemplar, setSelectedExemplar] = useState(null);
  const [showEmprestimoDialog, setShowEmprestimoDialog] = useState(false);

  const fetchLivros = async () => {
    try {
      const response = await fetch("/api/livros");
      if (!response.ok) {
        throw new Error("Falha ao carregar livros");
      }
      const data = await response.json();
      setLivros(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivros();
  }, []);

  const handleSolicitarEmprestimo = async (livro) => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setError("Você precisa estar logado para solicitar empréstimos");
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
        setError("Não há exemplares disponíveis para este livro");
        return;
      }

      const exemplarDisponivel = {
        id: exemplares[0].id,
        num_exemplar: exemplares[0].num_exemplar,
        livro: livro,
      };

      setSelectedExemplar(exemplarDisponivel);
      setShowEmprestimoDialog(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmprestimoSuccess = () => {
    fetchLivros();
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Empreste seu Próximo Livro</h1>
      <p className="text-lg text-gray-600 mb-8">
        Veja os títulos abaixo e solicite seu empréstimo com um clique.
      </p>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {livros.map((livro) => (
          <BookCard
            key={livro.id}
            book={livro}
            onEmprestar={() => handleSolicitarEmprestimo(livro)}
          />
        ))}
      </div>

      {selectedExemplar && (
        <SolicitarEmprestimoDialog
          isOpen={showEmprestimoDialog}
          onClose={() => {
            setShowEmprestimoDialog(false);
            setSelectedExemplar(null);
          }}
          exemplar={selectedExemplar}
          onSuccess={handleEmprestimoSuccess}
        />
      )}
    </div>
  );
}
