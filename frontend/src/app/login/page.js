"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Github, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";
import { api } from "@/app/services/api";

export default function LoginPage() {
  const router = useRouter();
  const { handleLogin } = useApp();

  const [loginData, setLoginData] = useState({
    email: "",
    senha: "",
  });

  const [registerData, setRegisterData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    curso_id: "", // Será preenchido após carregar os cursos
  });

  const [cursos, setCursos] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // Carrega a lista de cursos ao montar o componente
  useEffect(() => {
    const loadCursos = async () => {
      try {
        const response = await api.cursos.listar();
        setCursos(response);
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
        toast.error("Erro ao carregar a lista de cursos");
      }
    };

    loadCursos();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!loginData.email || !loginData.senha) {
      toast.error("Por favor, preencha todos os campos");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.auth.login(loginData);
      console.log("Resposta do login:", response); // Log para debug

      if (!response || !response.token || !response.usuario) {
        throw new Error("Resposta inválida do servidor");
      }

      // Salva o token
      localStorage.setItem("jwt_token", response.token);

      // Prepara os dados do usuário
      const userData = {
        id: response.usuario.id,
        nome: response.usuario.nome,
        role: response.usuario.perfil.toLowerCase(),
        curso_id: response.usuario.curso_id,
      };
      handleLogin(userData);
      toast.success(`Bem-vindo, ${userData.nome}!`);
      router.push("/");
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Nome de usuário ou senha inválidos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !registerData.nome ||
      !registerData.email ||
      !registerData.senha ||
      !registerData.confirmarSenha ||
      !registerData.curso_id
    ) {
      toast.error("Por favor, preencha todos os campos");
      setIsLoading(false);
      return;
    }

    if (registerData.senha !== registerData.confirmarSenha) {
      toast.error("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (registerData.senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      // Remove o campo confirmarSenha antes de enviar
      const { confirmarSenha, ...cadastroData } = registerData;

      console.log("Enviando dados de cadastro:", {
        ...cadastroData,
        senha: cadastroData.senha
          ? `${cadastroData.senha.length} caracteres`
          : "não definida",
      });

      const response = await api.auth.cadastro(cadastroData);
      console.log("Resposta do cadastro:", response);

      // Faz login automático após o cadastro
      console.log("Tentando login após cadastro...");
      const loginResponse = await api.auth.login({
        email: registerData.email,
        senha: registerData.senha,
      });

      localStorage.setItem("jwt_token", loginResponse.token);

      const userData = {
        id: loginResponse.usuario.id,
        nome: loginResponse.usuario.nome,
        role: loginResponse.usuario.perfil,
        curso_id: loginResponse.usuario.curso_id,
      };

      handleLogin(userData);
      toast.success(`Conta criada com sucesso! Bem-vindo, ${userData.nome}!`);
      router.push("/");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro ao criar conta. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginInputChange = (field, value) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegisterInputChange = (field, value) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src="/logo/Logo - OpenPages.svg"
              alt="OpenPages Logo"
              width={200}
              height={45}
              className="h-10 w-auto"
              priority
            />
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
              style={{ backgroundColor: "var(--background-color)" }}
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
                  <Label
                    htmlFor="login-email"
                    style={{ color: "var(--title-color)" }}
                  >
                    E-mail
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginData.email}
                    onChange={(e) =>
                      handleLoginInputChange("email", e.target.value)
                    }
                    className="rounded-lg border-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="login-senha"
                    style={{ color: "var(--title-color)" }}
                  >
                    Senha
                  </Label>
                  <Input
                    id="login-senha"
                    type="password"
                    placeholder="Sua senha"
                    value={loginData.senha}
                    onChange={(e) =>
                      handleLoginInputChange("senha", e.target.value)
                    }
                    className="rounded-lg border-gray-300"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 rounded-lg"
                  style={{
                    backgroundColor: "var(--primary-color)",
                    color: "var(--text-color-light)",
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-6">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="register-nome"
                    style={{ color: "var(--title-color)" }}
                  >
                    Nome Completo
                  </Label>
                  <Input
                    id="register-nome"
                    placeholder="Digite seu nome completo"
                    value={registerData.nome}
                    onChange={(e) =>
                      handleRegisterInputChange("nome", e.target.value)
                    }
                    className="rounded-lg border-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="register-email"
                    style={{ color: "var(--title-color)" }}
                  >
                    E-mail
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={registerData.email}
                    onChange={(e) =>
                      handleRegisterInputChange("email", e.target.value)
                    }
                    className="rounded-lg border-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="register-curso"
                    style={{ color: "var(--title-color)" }}
                  >
                    Curso
                  </Label>
                  <select
                    id="register-curso"
                    value={registerData.curso_id}
                    onChange={(e) =>
                      handleRegisterInputChange("curso_id", e.target.value)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                  >
                    <option value="">Selecione um curso</option>
                    {cursos.map((curso) => (
                      <option key={curso.id} value={curso.id}>
                        {curso.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="register-senha"
                    style={{ color: "var(--title-color)" }}
                  >
                    Senha
                  </Label>
                  <Input
                    id="register-senha"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={registerData.senha}
                    onChange={(e) =>
                      handleRegisterInputChange("senha", e.target.value)
                    }
                    className="rounded-lg border-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="register-confirmar-senha"
                    style={{ color: "var(--title-color)" }}
                  >
                    Confirmar Senha
                  </Label>
                  <Input
                    id="register-confirmar-senha"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={registerData.confirmarSenha}
                    onChange={(e) =>
                      handleRegisterInputChange(
                        "confirmarSenha",
                        e.target.value
                      )
                    }
                    className="rounded-lg border-gray-300"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 rounded-lg"
                  style={{
                    backgroundColor: "var(--primary-color)",
                    color: "var(--text-color-light)",
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
    </div>
  );
}
