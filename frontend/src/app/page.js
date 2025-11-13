"use client";

import { useApp } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { BookOpen, Lightbulb, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "@/styles/home.module.css";

export default function HomePage() {
  const { user } = useApp();
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-20">
        {/* Hero Section */}
        <div 
          className={`${styles.heroContainer} ${styles.heroSection} relative flex items-center justify-center text-center px-4 py-20`}
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        >
          <div className={styles.heroBgImage}></div>
          <div className={styles.heroGradient}></div>
          
          <div className="relative z-10 max-w-5xl mx-auto space-y-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-[#34362d]">
              Bem-vindo ao
              <br />
              <span className="text-[#45483b]">
                OpenPages
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Acesse toda a biblioteca acadêmica da FATEC em um só lugar.
              <br />
              <span className="text-gray-600 text-base md:text-lg mt-2 block">
                Um projeto integrador desenvolvido com dedicação por dois alunos do 3º semestre de DSM.
              </span>
            </p>

            {user.role === "admin" && (
              <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-6 max-w-2xl mx-auto shadow-sm">
                <p className="text-blue-900 leading-relaxed">
                   <strong>Bem-vindo, Administrador!</strong> Você tem acesso
                  completo para gerenciar a plataforma.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <button
                onClick={() => router.push("/courses")}
                className="group relative bg-[#45483b] text-white px-10 py-4 rounded-xl font-semibold transition-all duration-500 hover:shadow-xl hover:-translate-y-2 shadow-lg overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative">Explorar Cursos</span>
              </button>
              <button
                onClick={() => router.push("/meus-emprestimos")}
                className="group bg-[#fcf9f3]/95 backdrop-blur-md border-2 border-[#45483b]/40 text-[#45483b] px-10 py-4 rounded-xl font-semibold hover:bg-[#45483b]/10 hover:shadow-xl hover:-translate-y-2 hover:border-[#45483b] transition-all duration-500"
              >
                <span className="group-hover:tracking-wider transition-all duration-300">Meus Empréstimos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Features */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${styles.card1} group`}>
            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center space-y-6 h-full">
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#45483b]/10 to-[#45483b]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ${styles.floating}`}>
                <BookOpen className="w-10 h-10 text-[#45483b]" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-[#34362d]">
                  Acervo Completo
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Navegue por todos os cursos e descubra uma coleção cuidadosamente selecionada de{" "}
                  <strong>livros acadêmicos</strong> para enriquecer seus estudos.
                </p>
              </div>
            </div>
          </div>

          <div className={`${styles.card2} group`}>
            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center space-y-6 h-full">
              <div className={`${styles.floating} w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#45483b]/10 to-[#45483b]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <Lightbulb className="w-10 h-10 text-[#45483b]" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-[#34362d]">
                  Contribua Conosco
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  <strong>Sugira novos títulos</strong> que possam complementar nosso acervo e ajude a construir uma biblioteca ainda melhor.
                </p>
              </div>
            </div>
          </div>

          <div className={`${styles.card3} group`}>
            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center space-y-6 h-full">
              <div className={`${styles.floating} w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#45483b]/10 to-[#45483b]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <GraduationCap className="w-10 h-10 text-[#45483b]" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-[#34362d]">
                  Facilite seus Estudos
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Consulte a disponibilidade em tempo real e{" "}
                  <strong>solicite empréstimos</strong> de forma rápida e descomplicada.
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`${styles.ctaSection} max-w-5xl mx-auto px-4 pb-16`}>
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm p-16 rounded-3xl border border-gray-200/50 shadow-xl text-center space-y-8">
            <div className="space-y-6">
              <h3 className="text-4xl md:text-5xl font-bold text-[#34362d]">
                Pronto para explorar?
              </h3>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Mergulhe em um universo de conhecimento e encontre exatamente
                o que você precisa para brilhar nos seus estudos.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <button
                onClick={() => router.push("/about")}
                className="relative bg-gradient-to-r from-[#45483b] to-[#34362d] text-white px-14 py-6 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-xl group overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                <span className="relative flex items-center justify-center gap-3">
                  Conheça o Projeto
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </span>
              </button>
              <button
                onClick={() => router.push("/suggest")}
                className="bg-white border-2 border-[#45483b]/20 text-[#45483b] px-14 py-6 rounded-2xl font-bold text-lg hover:bg-[#45483b] hover:text-white hover:border-[#45483b] transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                Sugerir Livro
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
