"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { BookOpen, Github, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { handleLogin } = useApp();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!loginData.email || !loginData.password) {
      toast.error("Por favor, preencha todos os campos");
      setIsLoading(false);
      return;
    }

    // Simulação de autenticação
    setTimeout(() => {
      const userData = {
        email: loginData.email,
        name: loginData.email.includes('admin') ? 'Administrador' : 'Usuário',
        role: loginData.email.includes('admin') ? 'admin' : 'user'
      };

      handleLogin(userData);
      toast.success(`Bem-vindo, ${userData.name}!`);
      setIsLoading(false);
      router.push('/');
    }, 1000);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast.error("Por favor, preencha todos os campos");
      setIsLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    // Simulação de cadastro - todos os novos usuários são cadastrados como "user"
    setTimeout(() => {
      const userData = {
        email: registerData.email,
        name: registerData.name,
        role: "user" // Papel definido automaticamente como "user"
      };

      handleLogin(userData);
      toast.success(`Conta criada com sucesso! Bem-vindo, ${userData.name}!`);
      setIsLoading(false);
      router.push('/');
    }, 1000);
  };

  const handleLoginInputChange = (field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegisterInputChange = (field, value) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4" 
      style={{ backgroundColor: 'var(--background-color)' }}
    >
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8" style={{ color: 'var(--primary-color)' }} />
              <h1 className="text-2xl font-medium" style={{ color: 'var(--title-color)' }}>
                OpenPages
              </h1>
            </div>
          </div>
          <p className="text-gray-600">
            Plataforma de Livros Acadêmicos - FATEC
          </p>
        </div>

        {/* Auth Form */}
        <Card className="p-8 bg-white border border-gray-200 shadow-sm">
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList 
              className="grid w-full grid-cols-2 rounded-lg" 
              style={{ backgroundColor: 'var(--background-color)' }}
            >
              <TabsTrigger 
                value="login" 
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Cadastro
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" style={{ color: 'var(--title-color)' }}>
                    E-mail
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginData.email}
                    onChange={(e) => handleLoginInputChange("email", e.target.value)}
                    className="rounded-lg border-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" style={{ color: 'var(--title-color)' }}>
                    Senha
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Sua senha"
                    value={loginData.password}
                    onChange={(e) => handleLoginInputChange("password", e.target.value)}
                    className="rounded-lg border-gray-300"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-3 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--primary-color)',
                    color: 'var(--text-color-light)'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Para teste:</p>
                <p>Admin: admin@fatec.sp.gov.br</p>
                <p>Usuário: user@fatec.sp.gov.br</p>
                <p>Senha: qualquer senha</p>
              </div>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-6">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" style={{ color: 'var(--title-color)' }}>
                    Nome Completo
                  </Label>
                  <Input
                    id="register-name"
                    placeholder="Seu nome completo"
                    value={registerData.name}
                    onChange={(e) => handleRegisterInputChange("name", e.target.value)}
                    className="rounded-lg border-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" style={{ color: 'var(--title-color)' }}>
                    E-mail
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={registerData.email}
                    onChange={(e) => handleRegisterInputChange("email", e.target.value)}
                    className="rounded-lg border-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" style={{ color: 'var(--title-color)' }}>
                    Senha
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={registerData.password}
                    onChange={(e) => handleRegisterInputChange("password", e.target.value)}
                    className="rounded-lg border-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password" style={{ color: 'var(--title-color)' }}>
                    Confirmar Senha
                  </Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={registerData.confirmPassword}
                    onChange={(e) => handleRegisterInputChange("confirmPassword", e.target.value)}
                    className="rounded-lg border-gray-300"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-3 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--primary-color)',
                    color: 'var(--text-color-light)'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="space-y-4">
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
                  href="https://linkedin.com/in/iago-pinheiro" 
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
    </div>
  );
}
