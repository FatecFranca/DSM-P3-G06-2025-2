# OpenPages - Frontend

Frontend do sistema OpenPages desenvolvido em Next.js com App Router.

## 🚀 Tecnologias

- **Next.js** 15.5.4 (App Router)
- **React** 19.1.0
- **Tailwind CSS** 3.4.1
- **Radix UI** (Componentes acessíveis)
- **Lucide React** (Ícones)
- **Sonner** (Notificações toast)

## 📋 Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** ou **yarn**

## 🔧 Instalação e Configuração

### 1. Clone o repositório (se ainda não clonou)

```bash
git clone https://github.com/FatecFranca/DSM-P3-G06-2025-2.git
cd DSM-P3-G06-2025-2/frontend
```

### 2. Instale as dependências

```bash
npm install
```

ou

```bash
yarn install
```

### 3. Execute o projeto em modo de desenvolvimento

```bash
npm run dev
```

ou

```bash
yarn dev
```

### 4. Acesse a aplicação

O frontend estará disponível em: **http://localhost:3000**

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                    # Páginas e rotas (App Router)
│   │   ├── globals.css        # Estilos globais e variáveis CSS
│   │   ├── layout.js          # Layout principal
│   │   ├── page.js            # Página inicial
│   │   ├── about/             # Página sobre
│   │   ├── courses/           # Páginas de cursos
│   │   └── login/             # Página de login/registro
│   ├── components/            # Componentes reutilizáveis
│   │   ├── auth/              # Componentes de autenticação
│   │   ├── cards/             # Cards (CourseCard, etc)
│   │   ├── layout/            # Header, Footer, etc
│   │   └── ui/                # Componentes UI base (Button, Input, etc)
│   ├── contexts/              # Context API (AppContext)
│   ├── data/                  # Dados mockados
│   └── lib/                   # Utilitários
├── public/                    # Arquivos estáticos
│   └── logo/                  # Logos e imagens
├── tailwind.config.js         # Configuração do Tailwind CSS
├── postcss.config.mjs         # Configuração do PostCSS
├── next.config.mjs            # Configuração do Next.js
└── package.json               # Dependências do projeto
```

## 🎨 Variáveis CSS Customizadas

O projeto utiliza variáveis CSS para facilitar a customização de cores e temas. Você pode alterar as cores em `src/app/globals.css`:

```css
:root {
  --primary-color: #2563eb;        /* Azul principal */
  --background-color: #f3f4f6;     /* Cinza claro (fundo) */
  --title-color: #1e293b;          /* Cinza escuro (títulos) */
  --text-color: #64748b;           /* Cinza médio (textos) */
  --text-color-light: #ffffff;     /* Branco (texto em botões) */
}
```

## 🔐 Autenticação (Mock)

Atualmente o sistema utiliza **autenticação mockada** (sem integração com backend).

- **Admin**: Qualquer email que contenha "admin" (ex: admin@test.com)
- **Usuário comum**: Qualquer outro email

Para integrar com o backend, você precisará modificar o `AppContext.js` e criar os serviços de API necessários.

## 🛠️ Scripts Disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Cria build de produção
npm run start    # Inicia o servidor de produção
npm run lint     # Executa o linter
```

## Desenvolvido por

- **Iago Pinheiro** - [LinkedIn](https://www.linkedin.com/in/iago-pinheiroo/) | [GitHub](https://github.com/iago-pinheiro)
