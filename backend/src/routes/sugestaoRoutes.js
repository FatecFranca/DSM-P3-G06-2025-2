import express from "express";
import {
  createSugestao,
  getAllSugestoes,
  updateSugestaoStatus,
  deleteSugestao,
} from "../controllers/sugestaoController.js";
import { verifyJWT, isAdmin } from "../middleware/autenticacao.js";

const router = express.Router();

// --- ROTAS DE CONSULTA (Para todos os usuários logados) ---
router.post("/", verifyJWT, createSugestao);

// --- ROTAS DE ADMINISTRAÇÃO (Apenas para Administradores) ---
router.get("/", verifyJWT, isAdmin, getAllSugestoes);
router.patch("/:id/status", verifyJWT, isAdmin, updateSugestaoStatus);
router.delete("/:id", verifyJWT, isAdmin, deleteSugestao);

export default router;
