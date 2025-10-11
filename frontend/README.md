# OpenPages - Frontend

Frontend do sistema OpenPages desenvolvido em Next.js.

## Tecnologias

- Next.js 15.5.4
- React 19.1.0
- Tailwind CSS 4

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em: http://localhost:3000

## Estrutura do Projeto

```
src/
├── app/              # Páginas e rotas do Next.js
├── components/       # Componentes reutilizáveis
├── services/         # Serviços de API
└── utils/            # Funções utilitárias
```

## Backend

O backend deve estar rodando na porta 8080 (configurável via .env.local).
