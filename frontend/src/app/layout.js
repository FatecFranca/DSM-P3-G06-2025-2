import { AppProvider } from "@/contexts/AppContext";
import { Toaster } from "sonner";
import "@/styles/globals.css";

export const metadata = {
  title: "OpenPages - Projeto Integrador 3° Semestre FATEC Franca",
  description: "Sistema de  gerenciamento de livros academicos em bibliotecas universitarias",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProvider>
          {children}
          <Toaster position="top-right" />
        </AppProvider>
      </body>
    </html>
  );
}