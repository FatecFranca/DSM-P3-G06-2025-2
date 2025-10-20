import express from "express";
import {
  getAllExemplares,
  createExemplar,
  updateExemplar,
  deleteExemplar,
} from "../controllers/exemplarController.js";
import { verifyJWT, isAdmin } from "../middleware/autenticacao.js";

const router = express.Router();

// Rotas Públicas

/**
 * @swagger
 * /exemplares:
 *   get:
 *     summary: Listar exemplares de um livro
 *     tags: [Exemplares]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: livro_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do livro
 *     responses:
 *       200:
 *         description: Lista de exemplares
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   id_livro:
 *                     type: string
 *                   num_exemplar:
 *                     type: integer
 *                   livro:
 *                     type: object
 *                     properties:
 *                       titulo:
 *                         type: string
 *                   disponivel:
 *                     type: boolean
 *       400:
 *         description: ID do livro não fornecido
 *       401:
 *         description: Não autorizado
 */
router.get("/", verifyJWT, getAllExemplares);

// Rotas do Adiministrador

/**
 * @swagger
 * /exemplares:
 *   post:
 *     summary: Criar novo exemplar (admin)
 *     tags: [Exemplares]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_livro
 *               - num_exemplar
 *             properties:
 *               id_livro:
 *                 type: string
 *               num_exemplar:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Exemplar criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.post("/", verifyJWT, isAdmin, createExemplar);

/**
 * @swagger
 * /exemplares/{id}:
 *   put:
 *     summary: Atualizar exemplar (admin)
 *     tags: [Exemplares]
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
 *               - num_exemplar
 *             properties:
 *               num_exemplar:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Exemplar atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Exemplar não encontrado
 */
router.put("/:id", verifyJWT, isAdmin, updateExemplar);

/**
 * @swagger
 * /exemplares/{id}:
 *   delete:
 *     summary: Excluir exemplar (admin)
 *     tags: [Exemplares]
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
 *         description: Exemplar excluído com sucesso
 *       400:
 *         description: Não é possível excluir exemplar em empréstimo
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Exemplar não encontrado
 */
router.delete("/:id", verifyJWT, isAdmin, deleteExemplar);

export default router;
