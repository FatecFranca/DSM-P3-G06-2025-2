import "./globals.css";

export const metadata = {
  title: "OpenPages - Projeto Integrador",
  description: "Sistema de gerenciamento de bibliotecas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
