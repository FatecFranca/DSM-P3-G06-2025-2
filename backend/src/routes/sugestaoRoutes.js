import express from "express";
import {
  createSugestao,
  getAllSugestoes,
  updateSugestaoStatus,
  deleteSugestao,
} from "../controllers/sugestaoController.js";
import { verifyJWT, isAdmin } from "../middleware/autenticacao.js";

const router = express.Router();

// Rotas Públicas

/**
 * @swagger
 * /sugestoes:
 *   post:
 *     summary: Criar nova sugestão de livro
 *     tags: [Sugestões]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - livro_sugerido
 *               - autor
 *               - editora
 *               - motivo
 *             properties:
 *               livro_sugerido:
 *                 type: string
 *               autor:
 *                 type: string
 *               editora:
 *                 type: string
 *               motivo:
 *                 type: string
 *               curso_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sugestão criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post("/", verifyJWT, createSugestao);

// Rotas do Adiministrador

/**
 * @swagger
 * /sugestoes:
 *   get:
 *     summary: Listar todas as sugestões (admin)
 *     tags: [Sugestões]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendente, aprovada, rejeitada]
 *     responses:
 *       200:
 *         description: Lista de sugestões
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   livro_sugerido:
 *                     type: string
 *                   autor:
 *                     type: string
 *                   editora:
 *                     type: string
 *                   motivo:
 *                     type: string
 *                   status:
 *                     type: string
 *                   usuario:
 *                     type: object
 *                   curso:
 *                     type: object
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.get("/", verifyJWT, isAdmin, getAllSugestoes);

/**
 * @swagger
 * /sugestoes/{id}/status:
 *   patch:
 *     summary: Atualizar status da sugestão (admin)
 *     tags: [Sugestões]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [aprovada, rejeitada]
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Status inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Sugestão não encontrada
 */
router.patch("/:id/status", verifyJWT, isAdmin, updateSugestaoStatus);

/**
 * @swagger
 * /sugestoes/{id}:
 *   delete:
 *     summary: Excluir sugestão (admin)
 *     tags: [Sugestões]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Sugestão excluída com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Sugestão não encontrada
 */
router.delete("/:id", verifyJWT, isAdmin, deleteSugestao);

export default router;
