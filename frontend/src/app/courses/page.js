"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { CourseCard } from "@/components/cards/CourseCard";
import { courses } from "@/data/mock-data";
import { GraduationCap, BookOpen, ArrowRight } from "lucide-react";

export default function CoursesPage() {
  const router = useRouter();
  const { user } = useApp();

  const handleCourseSelect = (courseId) => {
    router.push(`/courses/${courseId}`);
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8 pt-8">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            <GraduationCap className="w-12 h-12 text-[#45483b]" />
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight" style={{ color: 'var(--title-color)' }}>
              Cursos da FATEC Franca
            </h1>
          </div>
          <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
        </div>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {user?.role === 'admin' 
            ? 'Selecione um curso para visualizar e gerenciar os livros disponíveis na biblioteca acadêmica'
            : 'Explore os recursos bibliográficos disponíveis para cada curso oferecido pela FATEC Franca'
          }
        </p>
      </div>
      
      {/* Courses Grid */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-2" style={{ color: 'var(--title-color)' }}>
            Selecione um Curso
          </h2>
          <p className="text-gray-600">
            Clique em um curso para ver os livros disponíveis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {courses.map((course) => (
            <div key={course.id} className="group">
              <div 
                onClick={() => handleCourseSelect(course.id)}
                className="bg-white p-8 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="inline-block px-3 py-1 bg-[#45483b]/10 rounded-lg">
                      <span className="text-sm font-medium text-[#45483b]">{course.code}</span>
                    </div>
                    <h3 className="text-xl font-medium leading-tight" style={{ color: 'var(--title-color)' }}>
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-10 h-10 rounded-full bg-[#45483b]/10 flex items-center justify-center group-hover:bg-[#45483b] group-hover:text-white transition-all duration-300">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto pt-8">
        <div className="bg-gradient-to-br from-white to-gray-50/50 p-10 rounded-3xl border border-gray-200/50 shadow-sm text-center space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl font-medium" style={{ color: 'var(--title-color)' }}>
              Não encontrou o que procura?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Você pode sugerir novos livros para enriquecer o acervo da sua área de estudo
            </p>
          </div>
          <button 
            onClick={() => router.push('/suggest')}
            className="px-8 py-4 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 shadow-sm"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            Sugerir Livro
          </button>
        </div>
      </div>
    </div>
  );
}
