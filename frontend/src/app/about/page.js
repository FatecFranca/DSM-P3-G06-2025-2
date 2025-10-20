"use client";

import { BookOpen, Users, Shield, Target, Github, Linkedin } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <BookOpen className="h-16 w-16" style={{ color: 'var(--primary-color)' }} />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-medium" style={{ color: 'var(--title-color)' }}>
            OpenPages
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plataforma de livros acadêmicos da FATEC que conecta estudantes aos recursos 
            bibliográficos essenciais para sua formação acadêmica.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card className="p-6 space-y-4 text-center border-gray-200 bg-white">
          <div className="flex justify-center">
            <Target className="h-12 w-12" style={{ color: 'var(--primary-color)' }} />
          </div>
          <h3 className="text-xl font-medium" style={{ color: 'var(--title-color)' }}>
            Missão
          </h3>
          <p className="text-gray-600">
            Facilitar o acesso aos recursos bibliográficos acadêmicos, 
            promovendo a pesquisa e o aprendizado de qualidade.
          </p>
        </Card>

        <Card className="p-6 space-y-4 text-center border-gray-200 bg-white">
          <div className="flex justify-center">
            <Users className="h-12 w-12" style={{ color: 'var(--primary-color)' }} />
          </div>
          <h3 className="text-xl font-medium" style={{ color: 'var(--title-color)' }}>
            Comunidade
          </h3>
          <p className="text-gray-600">
            Conectamos estudantes, professores e bibliotecários em uma 
            plataforma colaborativa de conhecimento.
          </p>
        </Card>

        <Card className="p-6 space-y-4 text-center border-gray-200 bg-white">
          <div className="flex justify-center">
            <Shield className="h-12 w-12" style={{ color: 'var(--primary-color)' }} />
          </div>
          <h3 className="text-xl font-medium" style={{ color: 'var(--title-color)' }}>
            Confiabilidade
          </h3>
          <p className="text-gray-600">
            Sistema seguro e organizado que garante informações atualizadas 
            sobre a disponibilidade dos recursos bibliográficos.
          </p>
        </Card>
      </div>

      {/* About Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-medium" style={{ color: 'var(--title-color)' }}>
            Sobre a Plataforma
          </h2>
          <div className="text-gray-600 space-y-4">
            <p>
              O OpenPages é uma plataforma desenvolvida especialmente para a comunidade acadêmica 
              da FATEC, oferecendo acesso centralizado aos recursos bibliográficos dos diferentes 
              cursos da instituição.
            </p>
            <p>
              Nossa plataforma permite que estudantes consultem a disponibilidade de livros, 
              façam sugestões de novas aquisições e tenham acesso facilitado aos materiais 
              essenciais para sua formação acadêmica.
            </p>
            <p>
              Com um design minimalista e acadêmico, o OpenPages prioriza a usabilidade e 
              a eficiência, garantindo que os usuários encontrem rapidamente as informações 
              que precisam para seus estudos e pesquisas.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-medium" style={{ color: 'var(--title-color)' }}>
            Cursos Atendidos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2" style={{ color: 'var(--title-color)' }}>
                DSM - Desenvolvimento de Software Multiplataforma
              </h3>
              <p className="text-gray-600 text-sm">
                Recursos focados em programação, engenharia de software e tecnologias multiplataforma.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2" style={{ color: 'var(--title-color)' }}>
                ADS - Análise e Desenvolvimento de Sistemas
              </h3>
              <p className="text-gray-600 text-sm">
                Bibliografia especializada em análise de sistemas, modelagem e desenvolvimento.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2" style={{ color: 'var(--title-color)' }}>
                GPI - Gestão da Produção Industrial
              </h3>
              <p className="text-gray-600 text-sm">
                Materiais sobre gestão, produção industrial e otimização de processos.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2" style={{ color: 'var(--title-color)' }}>
                GRH - Gestão de Recursos Humanos
              </h3>
              <p className="text-gray-600 text-sm">
                Livros sobre gestão de pessoas, psicologia organizacional e administração.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-medium" style={{ color: 'var(--title-color)' }}>
            Nossa Equipe
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium" style={{ color: 'var(--title-color)' }}>
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left font-medium" style={{ color: 'var(--title-color)' }}>
                      Cargo
                    </th>
                    <th className="px-6 py-4 text-left font-medium" style={{ color: 'var(--title-color)' }}>
                      Responsabilidades
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="font-medium" style={{ color: 'var(--title-color)' }}>
                        Pedro H. Xavier Constancio
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      Product Owner / Dev
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      Visão do produto, priorização, back-end, autenticação e integração.
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="font-medium" style={{ color: 'var(--title-color)' }}>
                        Iago Rodrigues Pinheiro
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      Desenvolvedor
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      Implementação front-end, UX/UI e integração do sistema de login.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-4 pt-8">
        {/* Divisor */}
        <div className="w-16 h-px bg-gray-300 mx-auto"></div>
        
        {/* Desenvolvedores */}
        <div className="flex flex-col items-center gap-3">
          {/* Pedro */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Pedro H Xavier Constancio</span>
            <div className="flex gap-2">
              <a 
                href="https://www.linkedin.com/in/pedro-xavier9/" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="https://github.com/Ph-Xavier" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800 transition-colors"
                title="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Iago */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Iago Rodrigues Pinheiro</span>
            <div className="flex gap-2">
              <a 
                href="https://www.linkedin.com/in/iago-pinheiroo/" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="https://github.com/iago-pinheiro" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800 transition-colors"
                title="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <p className="text-center text-xs text-gray-400">
          © 2025 OpenPages - FATEC Franca
        </p>
      </div>
    </div>
  );
}
