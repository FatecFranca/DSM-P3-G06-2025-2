import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index.js";
import usuarioRouter from "./routes/usuarioRoutes.js";
import cursoRouter from "./routes/cursoRoutes.js";
import livroRouter from "./routes/livroRoutes.js";
import exemplarRouter from "./routes/exemplarRoutes.js";
import emprestimoRouter from "./routes/emprestimoRoutes.js";

const app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/cursos", cursoRouter);
app.use("/livros", livroRouter);
app.use("/exemplares", exemplarRouter);
app.use("/emprestimos", emprestimoRouter);

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
