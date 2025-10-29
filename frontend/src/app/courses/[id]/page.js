"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Search, Heart, BookOpen, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/app/services/api";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [course, setCourse] = useState(null);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const courseId = params.id;

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Carregar todos os cursos e encontrar o específico
        const allCourses = await api.cursos.listar();
        const courseData = allCourses.find(c => c.id === courseId);
        
        if (!courseData) {
          setCourse(null);
          setIsLoading(false);
          return;
        }
        
        setCourse(courseData);
        
        // Carregar todos os livros e filtrar por curso
        const allBooks = await api.livros.listar();
        const courseBooksFiltered = allBooks.filter(book => book.curso_id === courseId);
        setBooks(courseBooksFiltered);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Não foi possível carregar as informações do curso");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [courseId]);
  
  const filteredBooks = books.filter(book => 
    book.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.autor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoanRequest = (book) => {
    if (!book.disponibilidade) {
      toast.error("Este livro não está disponível no momento");
      return;
    }

    toast.success(`Solicitação de empréstimo para "${book.titulo}" enviada com sucesso!`);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-40"></div>
        <div className="bg-gray-200 h-64 rounded-3xl"></div>
        <div className="bg-gray-200 h-96 rounded-2xl"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-6 max-w-md">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xl font-bold">!</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold" style={{ color: 'var(--title-color)' }}>
              Curso não encontrado
            </h2>
            <p className="text-gray-600 leading-relaxed">
              O curso que você está procurando não existe ou foi removido. Volte para a lista de cursos e tente novamente.
            </p>
          </div>
          
          <Button 
            onClick={() => router.push('/courses')}
            className="px-8 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            style={{ 
              backgroundColor: 'var(--primary-color)',
              color: 'var(--text-color-light)'
            }}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar aos Cursos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/courses')}
        className="flex items-center gap-2 text-[#45483b] hover:text-[#45483b]/80 font-medium transition-colors duration-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar aos Cursos
      </button>

      {/* Course Info - Hero Style */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 p-8 md:p-12 rounded-3xl border border-gray-200/50 shadow-sm">
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight" style={{ color: 'var(--title-color)' }}>
              {course.nome}
            </h1>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 leading-relaxed">
              {course.descricao || "Sem descrição disponível"}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-4">
            <BookOpen className="h-4 w-4" />
            <span>{filteredBooks.length} {filteredBooks.length === 1 ? 'livro disponível' : 'livros disponíveis'}</span>
          </div>
        </div>
      </div>

      {/* Books Section */}
      <Card className="p-8 bg-white border border-gray-200/50 shadow-sm rounded-2xl">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-medium" style={{ color: 'var(--title-color)' }}>
                Acervo Bibliográfico
              </h2>
              <p className="text-sm text-gray-600">
                Explore os livros disponíveis para este curso
              </p>
            </div>
            
            <Button
              onClick={() => router.push('/suggest')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              style={{ 
                backgroundColor: 'var(--primary-color)',
                color: 'var(--text-color-light)'
              }}
            >
              <Heart className="h-4 w-4" />
              Sugerir Novo Livro
            </Button>
          </div>

          {/* Search Bar */}
          <div className="max-w-md relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por título ou autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 rounded-xl border-gray-300 shadow-sm focus:shadow-md transition-shadow"
            />
          </div>

          {/* Results Counter */}
          {searchTerm && (
            <div className="text-sm text-gray-600 bg-blue-50/50 border border-blue-100 rounded-lg px-4 py-2 inline-block">
              Encontrados <span className="font-medium text-[#45483b]">{filteredBooks.length}</span> {filteredBooks.length === 1 ? 'resultado' : 'resultados'} para "{searchTerm}"
            </div>
          )}

          {/* Books Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200/50 shadow-sm">
            <Table>
              <TableHeader style={{ backgroundColor: 'var(--primary-color)' }}>
                <TableRow className="border-b-0">
                  <TableHead className="py-4" style={{ color: 'var(--text-color-light)' }}>Livro</TableHead>
                  <TableHead className="py-4" style={{ color: 'var(--text-color-light)' }}>Autor</TableHead>
                  <TableHead className="py-4" style={{ color: 'var(--text-color-light)' }}>Editora</TableHead>
                  <TableHead className="py-4" style={{ color: 'var(--text-color-light)' }}>Edição</TableHead>
                  <TableHead className="py-4" style={{ color: 'var(--text-color-light)' }}>Status</TableHead>
                  {user?.role === 'user' && (
                    <TableHead className="py-4" style={{ color: 'var(--text-color-light)' }}>Ação</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium py-4">{book.titulo}</TableCell>
                    <TableCell className="py-4 text-gray-600">{book.autor}</TableCell>
                    <TableCell className="py-4 text-gray-600">{book.editora}</TableCell>
                    <TableCell className="py-4 text-gray-600">{book.edicao}</TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        variant={book.disponibilidade ? 'default' : 'destructive'}
                        className={book.disponibilidade ? 'bg-green-100 text-green-700 hover:bg-green-100 shadow-sm' : 'shadow-sm'}
                      >
                        {book.disponibilidade ? 'Disponível' : 'Indisponível'}
                      </Badge>
                    </TableCell>
                    {user?.role === 'user' && (
                      <TableCell className="py-4">
                        <Button
                          size="sm"
                          onClick={() => handleLoanRequest(book)}
                          disabled={!book.disponibilidade}
                          className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                          style={{ 
                            backgroundColor: book.disponibilidade ? 'var(--primary-color)' : undefined,
                            color: book.disponibilidade ? 'var(--text-color-light)' : undefined
                          }}
                        >
                          {book.disponibilidade ? 'Empréstimo' : 'Indisponível'}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {filteredBooks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={user?.role === 'user' ? 6 : 5} className="text-center py-12">
                      <div className="space-y-2">
                        <BookOpen className="h-12 w-12 mx-auto text-gray-300" />
                        <p className="text-gray-500 font-medium">
                          {searchTerm ? 'Nenhum livro encontrado' : 'Nenhum livro cadastrado'}
                        </p>
                        <p className="text-sm text-gray-400">
                          {searchTerm ? 'Tente buscar com outros termos' : 'Aguarde novos livros serem adicionados'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
