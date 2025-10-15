import express from "express";
import {
  createEmprestimo,
  getMeusEmprestimos,
  getAllEmprestimos,
  updateEmprestimo,
  deleteEmprestimo,
} from "../controllers/emprestimoController.js";
import { verifyJWT, isAdmin } from "../middleware/autenticacao.js";

const router = express.Router();

// --- ROTAS DE CONSULTA (Para todos os usuários logados) ---
router.post("/", verifyJWT, createEmprestimo);
router.get("/meusEmprestimos", verifyJWT, getMeusEmprestimos);

// --- ROTAS DE ADMINISTRAÇÃO (Apenas para Administradores) ---
router.get("/", verifyJWT, isAdmin, getAllEmprestimos);
router.put("/:id", verifyJWT, isAdmin, updateEmprestimo);
router.delete("/:id", verifyJWT, isAdmin, deleteEmprestimo);

export default router;
