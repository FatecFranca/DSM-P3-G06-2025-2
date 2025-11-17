# DSM-P3-G06-2025-2

Repositório do GRUPO 06 do Projeto Interdisciplinar do 3º semestre DSM 2025/2. Alunos: Iago Rodrigues Pinheiro, Pedro Henrique Xavier Constancio.

---

# 📚 OpenPages - Gestão de Biblioteca Acadêmica

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-000000?style=for-the-badge&logo=nextdotjs)
![Node.js](https://img.shields.io/badge/Node.js-black?style=for-the-badge&logo=nodedotjs)
![Prisma](https://img.shields.io/badge/Prisma-6.16-2D3748?style=for-the-badge&logo=prisma)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb)

O OpenPages é um sistema web completo para o gerenciamento de livros acadêmicos em bibliotecas universitárias, focado em otimizar o acesso de estudantes e professores ao acervo.

Este projeto foi desenvolvido como Projeto Interdisciplinar (PI) do 3º Semestre de Desenvolvimento de Software Multiplataforma (DSM) da FATEC Franca.

## 🚀 Links ao Vivo & Apresentação

Você pode ver o projeto em ação nos seguintes links:

- **Frontend (App):** [https://open-pages.onrender.com](https://open-pages.onrender.com)
- **Backend (API):** [https://openpages-backend.onrender.com](https://openpages-backend.onrender.com)
- **Vídeo de Apresentação (Pitch):** [https://youtu.be/39E0f5pmp3M?si=pBcvrwxjS5l3FGKt](https://youtu.be/39E0f5pmp3M?si=pBcvrwxjS5l3FGKt)

---

## 📖 Visão Geral

A plataforma atende a dois perfis principais de usuários:

- **Usuários (Alunos/Professores):** Podem explorar o catálogo de livros por curso, verificar a disponibilidade em tempo real, solicitar empréstimos online e sugerir novos títulos para o acervo.
- **Administradores (Bibliotecários):** Possuem um painel de controle completo para gerenciar todo o ciclo de vida do acervo, incluindo usuários, livros, exemplares, cursos, empréstimos e sugestões.

O projeto utiliza uma arquitetura de monorepo, contendo:

- `./frontend`: Uma aplicação Next.js com App Router.
- `./backend`: Uma API RESTful em Node.js/Express, com Prisma e MongoDB.

---

## ✨ Funcionalidades Principais

### 🧑‍🎓 Para Usuários

- **Autenticação:** Sistema de login e cadastro de novos usuários.
- **Exploração de Catálogo:** Visualize livros por curso ou busque pelo catálogo completo.
- **Verificação de Disponibilidade:** Cards de livros e páginas de detalhes mostram instantaneamente se um livro está "Disponível" ou "Indisponível".
- **Solicitação de Empréstimo:** Processo de empréstimo online com seleção de exemplares e confirmação de termos.
- **Meus Empréstimos:** Uma página dedicada onde o usuário pode ver seu histórico e empréstimos ativos, incluindo datas de devolução.
- **Sugestão de Livros:** Um formulário dedicado para que usuários sugiram novos títulos, autores e editoras para o acervo.

### 🛠️ Para Administradores

- **Dashboard Central:** Um painel com acesso a todos os módulos de gerenciamento do sistema.
- **Gestão de CRUD Completa:**
  - **Usuários:** Criar, editar e excluir usuários.
  - **Livros:** Criar, editar e excluir livros do acervo.
  - **Cursos:** Criar, editar e excluir os cursos da instituição.
  - **Exemplares:** Adicionar ou remover cópias físicas (exemplares) de cada livro.
- **Gerenciamento de Fluxos:**
  - **Empréstimos:** Acompanhar e "Finalizar" empréstimos (marcando-os como "concluído").
  - **Sugestões:** Aprovar (redirecionando para o cadastro de livro) ou Rejeitar sugestões de usuários.
- **Sistema de Filtros:** Todas as páginas de gerenciamento possuem filtros robustos para facilitar a busca por nome, status, título, etc..

### ⚙️ Funcionalidades do Backend

- **API RESTful:** Construída com Express, seguindo padrões de design com controllers e rotas separadas.
- **Autenticação JWT:** Rotas protegidas usando JSON Web Tokens, com middleware para verificar usuários e administradores (`isAdmin`).
- **Tarefa Agendada (Cron Job):** Um script automático (`node-cron`) que roda diariamente no servidor para verificar empréstimos "ativos" e atualizá-los para "atrasado" se a data de devolução tiver passado.
- **Documentação de API:** Geração automática de documentação com Swagger (OpenAPI).
- **ORM e Banco NoSQL:** Utiliza Prisma como ODM (Object-Document Mapper) para interagir de forma segura e tipada com um banco de dados MongoDB.

---

## 💻 Tecnologias Utilizadas

| Categoria    | Tecnologia              | Propósito                                             |
| :----------- | :---------------------- | :---------------------------------------------------- |
| **Frontend** | React 19                | Biblioteca principal para UI.                         |
|              | Next.js 15 (App Router) | Framework React para renderização (SSR/SSG/CSR).      |
|              | Tailwind CSS            | Framework de estilização "utility-first".             |
|              | Radix UI                | Componentes UI acessíveis (Dialog, Select, Tabs).     |
|              | Lucide React            | Biblioteca de ícones.                                 |
|              | Sonner                  | Para notificações e alertas (toasts).                 |
|              | Context API             | Gerenciamento de estado global (autenticação).        |
| **Backend**  | Node.js                 | Ambiente de execução.                                 |
|              | Express.js              | Framework para construção da API RESTful.             |
|              | Prisma                  | ORM/ODM para comunicação com o banco de dados.        |
|              | MongoDB                 | Banco de dados NoSQL (orientado a documentos).        |
|              | JSON Web Token (JWT)    | Para autenticação e autorização de rotas.             |
|              | `node-cron`             | Para agendamento da tarefa de verificação de atrasos. |
|              | Swagger                 | Documentação da API.                                  |
|              | `bcryptjs`              | Para hash de senhas.                                  |
| **Deploy**   | Render.com              | Plataforma de nuvem para deploy dos serviços.         |

---

## 🚀 Como Executar o Projeto

Este projeto é um monorepo. Você precisará executar o `backend` e o `frontend` em terminais separados.

### Pré-requisitos

- Node.js (v18 ou superior)
- NPM ou Yarn
- Uma instância de banco de dados MongoDB (local ou em nuvem, como o MongoDB Atlas)

---

### 1. Configuração do Backend

1.  **Navegue até a pasta do backend:**

    ```bash
    cd backend
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz da pasta `backend/`. Utilize o `backend/.env.example` como base.

    ```ini
    # String de conexão do seu banco MongoDB
    DATABASE_URL="mongodb+srv://..."

    # Chave secreta para o JWT (pode ser qualquer string longa e aleatória)
    JWT_SECRET="SEU_SEGREDO_JWT_AQUI"
    ```

4.  **Execute o Prisma Generate:**
    Este comando lê seu `schema.prisma` e gera o cliente Prisma.

    ```bash
    npx prisma generate
    ```

5.  **Inicie o servidor backend:**
    ```bash
    npm run dev
    ```
    O backend estará rodando em `http://localhost:8080`.

---

### 2. Configuração do Frontend

1.  **Abra um _novo terminal_**.
2.  **Navegue até a pasta do frontend:**

    ```bash
    cd frontend
    ```

3.  **Instale as dependências:**

    ```bash
    npm install
    ```

4.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env.local` na raiz da pasta `frontend/`. Utilize o `frontend/.env.example` como base.

    ```ini
    NEXT_PUBLIC_API_URL=http://localhost:8080
    ```

    _(Esta URL deve apontar para o seu backend, que iniciamos no passo anterior)._

5.  **Inicie o servidor frontend:**
    ```bash
    npm run dev
    ```
    O frontend estará acessível em `http://localhost:3000`.

---

## 👨‍💻 Autores

Este projeto foi desenvolvido por:

- **Iago Rodrigues Pinheiro**
  - [GitHub: iago-pinheiro](https://github.com/iago-pinheiro)
  - [LinkedIn: iago-pinheiroo](https://www.linkedin.com/in/iago-pinheiroo/)
- **Pedro Henrique Xavier Constancio**
  - [GitHub: Ph-Xavier](https://github.com/Ph-Xavier)
  - [LinkedIn: pedro-xavier9](https://www.linkedin.com/in/pedro-xavier9/)
