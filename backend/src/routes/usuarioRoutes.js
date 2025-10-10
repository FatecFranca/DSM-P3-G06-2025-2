import express from "express";
import {
  login,
  createUsuario,
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuarioController.js";
import { verifyJWT, isAdmin } from "../middleware/autenticacao.js";

const router = express.Router();

// --- ROTA PÚBLICA ---
router.post("/login", login);

// --- ROTAS PROTEGIDAS (Apenas para Administradores) ---
router.post("/", verifyJWT, isAdmin, createUsuario);
router.get("/", verifyJWT, isAdmin, getAllUsuarios);
router.get("/:id", verifyJWT, isAdmin, getUsuarioById);
router.put("/:id", verifyJWT, isAdmin, updateUsuario);
router.delete("/:id", verifyJWT, isAdmin, deleteUsuario);

export default router;
