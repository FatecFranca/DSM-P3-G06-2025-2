"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, User, LogOut, Settings, Info, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";

export function Header() {
  const { user, handleLogout } = useApp();
  const pathname = usePathname();

  const onLogout = () => {
    handleLogout();
    toast.success("Logout realizado com sucesso!");
  };

  const getNavItems = () => {
    if (!user) return [];
    
    const baseItems = [
      { id: "/", label: "Home", icon: Home },
      { id: "/courses", label: "Cursos", icon: GraduationCap },
      { id: "/about", label: "Sobre", icon: Info }
    ];

    if (user.role === 'admin') {
      baseItems.push({ id: "/admin", label: "Administração", icon: Settings });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  if (!user) return null;

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo/Logo - OpenPages.svg" 
            alt="OpenPages Logo" 
            width={180} 
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Navegação */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.id;
            
            return (
              <Link key={item.id} href={item.id}>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          
          {/* Info Usuário e Logout */}
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium" style={{ color: 'var(--title-color)' }}>
                  {user.name}
                </span>
                <Badge 
                  variant={user.role === 'admin' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                </Badge>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
