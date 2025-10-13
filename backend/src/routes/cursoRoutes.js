import express from "express";
import {
  getAllCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso,
} from "../controllers/cursoController.js";
import { verifyJWT, isAdmin } from "../middleware/autenticacao.js";

const router = express.Router();

// --- ROTAS DE CONSULTA (Para todos os usuários logados) ---
router.get("/", verifyJWT, getAllCursos);
router.get("/:id", verifyJWT, getCursoById);

// --- ROTAS DE ADMINISTRAÇÃO (Apenas para Administradores) ---
router.post("/", verifyJWT, isAdmin, createCurso);
router.put("/:id", verifyJWT, isAdmin, updateCurso);
router.delete("/:id", verifyJWT, isAdmin, deleteCurso);

export default router;
