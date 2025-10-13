import express from "express";
import {
  getAllLivros,
  getLivroById,
  createLivro,
  updateLivro,
  deleteLivro,
} from "../controllers/livroController.js";
import { verifyJWT, isAdmin } from "../middleware/autenticacao.js";

const router = express.Router();

// --- ROTAS DE CONSULTA (Para todos os usuários logados) ---
router.get("/", verifyJWT, getAllLivros);
router.get("/:id", verifyJWT, getLivroById);

// --- ROTAS DE ADMINISTRAÇÃO (Apenas para Administradores) ---
router.post("/", verifyJWT, isAdmin, createLivro);
router.put("/:id", verifyJWT, isAdmin, updateLivro);
router.delete("/:id", verifyJWT, isAdmin, deleteLivro);

export default router;
