import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

// Importações de Swagger
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Importação das rotas
import usuarioRouter from "./routes/usuarioRoutes.js";
import cursoRouter from "./routes/cursoRoutes.js";
import livroRouter from "./routes/livroRoutes.js";
import exemplarRouter from "./routes/exemplarRoutes.js";
import emprestimoRouter from "./routes/emprestimoRoutes.js";
import sugestaoRouter from "./routes/sugestaoRoutes.js";

const app = express();

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API OpenPages",
      version: "1.0.0",
      description:
        "API para o sistema de gerenciamento de bibliotecas OpenPages",
    },
    servers: [
      {
        url: "http://localhost:8080/api-docs", // Servidor de desenvolvimento
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Configuração do CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// Definição das rotas
app.use("/usuarios", usuarioRouter);
app.use("/cursos", cursoRouter);
app.use("/livros", livroRouter);
app.use("/exemplares", exemplarRouter);
app.use("/emprestimos", emprestimoRouter);
app.use("/sugestoes", sugestaoRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware para lidar com rotas não encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;
