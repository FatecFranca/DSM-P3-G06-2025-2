import express from "express";
import {
  getAllExemplares,
  createExemplar,
  updateExemplar,
  deleteExemplar,
} from "../controllers/exemplarController.js";
import { verifyJWT, isAdmin } from "../middleware/autenticacao.js";

const router = express.Router();

// --- ROTA DE CONSULTA (Para todos os usuários logados) ---
router.get("/", verifyJWT, getAllExemplares);

// --- ROTAS DE ADMINISTRAÇÃO (Apenas para Administradores) ---
router.post("/", verifyJWT, isAdmin, createExemplar);
router.put("/:id", verifyJWT, isAdmin, updateExemplar);
router.delete("/:id", verifyJWT, isAdmin, deleteExemplar);

export default router;
