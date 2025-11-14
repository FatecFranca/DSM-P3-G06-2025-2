"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  User,
  LogOut,
  Settings,
  Info,
  GraduationCap,
  Book,
  Library,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";

export function Header() {
  const { user, handleLogout } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onLogout = () => {
    handleLogout();
    toast.success("Logout realizado com sucesso!");
    setMobileMenuOpen(false);
  };

  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      { id: "/", label: "Home", icon: Home },
      { id: "/courses", label: "Cursos", icon: GraduationCap },
      { id: "/meus-emprestimos", label: "Meus Empréstimos", icon: Library },
      { id: "/about", label: "Sobre", icon: Info },
    ];

    if (user.role === "admin") {
      baseItems.push({ id: "/admin", label: "Administração", icon: Settings });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  if (!user) return null;

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="w-full flex items-center justify-between gap-4">
          {/* Logo - Extremidade Esquerda */}
          <Link 
            href="/" 
            className="flex items-center gap-2 flex-shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image
              src="/logo/Logo - OpenPages.svg"
              alt="OpenPages Logo"
              width={180}
              height={40}
              className="h-7 sm:h-8 w-auto"
              priority
            />
          </Link>

          {/* Navigation - Centro */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1 justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.id;

              return (
                <Link key={item.id} href={item.id}>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Desktop User Info - Extremidade Direita */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <User className="h-4 w-4 text-gray-500" />
              <div className="flex flex-col items-start">
                <span
                  className="text-sm font-medium whitespace-nowrap"
                  style={{ color: "var(--title-color)" }}
                >
                  {user.name}
                </span>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {user.role === "admin" ? "Administrador" : "Usuário"}
                </Badge>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.id;

                return (
                  <Link 
                    key={item.id} 
                    href={item.id}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-gray-700 hover:text-primary hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile User Info */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <div className="flex flex-col items-start">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--title-color)" }}
                  >
                    {user.name}
                  </span>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {user.role === "admin" ? "Administrador" : "Usuário"}
                  </Badge>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
