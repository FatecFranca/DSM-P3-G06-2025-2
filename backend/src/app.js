import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index.js";
import usuarioRouter from "./routes/usuarioRoutes.js";
import cursoRouter from "./routes/cursoRoutes.js";

const app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/cursos", cursoRouter);

export default app;
