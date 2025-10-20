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

// Rotas Públicas

/**
 * @swagger
 * /emprestimos:
 *   post:
 *     summary: Criar novo empréstimo
 *     tags: [Empréstimos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exemplarId
 *               - data_devolucao_prevista
 *             properties:
 *               exemplarId:
 *                 type: string
 *               data_devolucao_prevista:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Empréstimo criado com sucesso
 *       400:
 *         description: Dados inválidos ou exemplar indisponível
 *       401:
 *         description: Não autorizado
 */
router.post("/", verifyJWT, createEmprestimo);

/**
 * @swagger
 * /emprestimos/meusEmprestimos:
 *   get:
 *     summary: Listar meus empréstimos
 *     tags: [Empréstimos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empréstimos do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   livro:
 *                     type: object
 *                     properties:
 *                       titulo:
 *                         type: string
 *                       autor:
 *                         type: string
 *                   exemplar:
 *                     type: object
 *                   data_emprestimo:
 *                     type: string
 *                     format: date-time
 *                   data_devolucao_prevista:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                     enum: [ativo, concluido, atrasado]
 *       401:
 *         description: Não autorizado
 */
router.get("/meusEmprestimos", verifyJWT, getMeusEmprestimos);

// Rotas do Adiministrador

/**
 * @swagger
 * /emprestimos:
 *   get:
 *     summary: Listar todos os empréstimos (admin)
 *     tags: [Empréstimos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: exemplarId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ativo, concluido, atrasado]
 *     responses:
 *       200:
 *         description: Lista de empréstimos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   usuario:
 *                     type: object
 *                   livro:
 *                     type: object
 *                   exemplar:
 *                     type: object
 *                   status:
 *                     type: string
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.get("/", verifyJWT, isAdmin, getAllEmprestimos);

/**
 * @swagger
 * /emprestimos/{id}:
 *   put:
 *     summary: Atualizar empréstimo (admin)
 *     tags: [Empréstimos]
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
 *                 enum: [ativo, concluido, atrasado]
 *               data_devolucao_real:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Empréstimo atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Empréstimo não encontrado
 */
router.put("/:id", verifyJWT, isAdmin, updateEmprestimo);

/**
 * @swagger
 * /emprestimos/{id}:
 *   delete:
 *     summary: Excluir empréstimo (admin)
 *     tags: [Empréstimos]
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
 *         description: Empréstimo excluído com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Empréstimo não encontrado
 */
router.delete("/:id", verifyJWT, isAdmin, deleteEmprestimo);

export default router;
