"use client";

import { useApp } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { BookOpen, Lightbulb, GraduationCap } from "lucide-react";

export default function HomePage() {
  const { user } = useApp();
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="text-center space-y-8 pt-12 pb-8">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight" style={{ color: 'var(--title-color)' }}>
            Bem-vindo ao OpenPages
          </h1>
          <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
        </div>
        <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
          Sua plataforma de livros acadêmicos da FATEC. Explore recursos bibliográficos, 
          consulte disponibilidade e contribua com sugestões para enriquecer nossa biblioteca.
        </p>
        {user.role === 'admin' && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6 max-w-2xl mx-auto shadow-sm">
            <p className="text-blue-800 leading-relaxed">
              👋 <strong>Bem-vindo, Administrador!</strong> Você tem acesso completo para gerenciar 
              livros e visualizar todas as funcionalidades da plataforma.
            </p>
          </div>
        )}
      </div>
      
      {/* Main Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="group">
          <div className="bg-white p-8 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#45483b]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-8 h-8 text-[#45483b]" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-medium" style={{ color: 'var(--title-color)' }}>
                Consulte Livros
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Navegue pelos cursos e encontre os livros disponíveis para cada disciplina com facilidade e rapidez.
              </p>
            </div>
          </div>
        </div>
        
        <div className="group">
          <div className="bg-white p-8 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#45483b]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Lightbulb className="w-8 h-8 text-[#45483b]" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-medium" style={{ color: 'var(--title-color)' }}>
                Faça Sugestões
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Sugira novos livros que considera importantes para seu curso e contribua para o crescimento do acervo.
              </p>
            </div>
          </div>
        </div>
        
        <div className="group">
          <div className="bg-white p-8 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#45483b]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="w-8 h-8 text-[#45483b]" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-medium" style={{ color: 'var(--title-color)' }}>
                Apoie seus Estudos
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Acesse informações atualizadas sobre disponibilidade e solicite empréstimos de forma simples.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-white to-gray-50/50 p-12 rounded-3xl border border-gray-200/50 shadow-sm text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-3xl font-medium" style={{ color: 'var(--title-color)' }}>
              Pronto para começar?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Explore nosso catálogo de livros acadêmicos e encontre os recursos que você precisa para seus estudos.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button 
              onClick={() => router.push('/courses')}
              className="px-8 py-4 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 shadow-sm"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              Explorar Cursos
            </button>
            <button 
              onClick={() => router.push('/about')}
              className="px-8 py-4 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:shadow-sm bg-white"
            >
              Saiba Mais
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
