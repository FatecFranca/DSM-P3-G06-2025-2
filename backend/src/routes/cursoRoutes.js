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

// Rotas Públicas

/**
 * @swagger
 * /cursos:
 *   get:
 *     summary: Listar todos os cursos
 *     tags: [Cursos]
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                   duracao:
 *                     type: number
 *                   _count:
 *                     type: object
 *                     properties:
 *                       usuarios:
 *                         type: number
 *                       livros:
 *                         type: number
 */
router.get("/", getAllCursos);

// Rotas do Adiministrador

/**
 * @swagger
 * /cursos/{id}:
 *   get:
 *     summary: Obter curso por ID (admin)
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do curso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 duracao:
 *                   type: number
 *                 livros:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Curso não encontrado
 */
router.get("/:id", verifyJWT, isAdmin, getCursoById);

/**
 * @swagger
 * /cursos:
 *   post:
 *     summary: Criar novo curso (admin)
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - descricao
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.post("/", verifyJWT, isAdmin, createCurso);

/**
 * @swagger
 * /cursos/{id}:
 *   put:
 *     summary: Atualizar curso (admin)
 *     tags: [Cursos]
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
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Curso não encontrado
 */
router.put("/:id", verifyJWT, isAdmin, updateCurso);

/**
 * @swagger
 * /cursos/{id}:
 *   delete:
 *     summary: Excluir curso (admin)
 *     tags: [Cursos]
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
 *         description: Curso excluído com sucesso
 *       400:
 *         description: Não é possível excluir curso com usuários ou livros associados
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Curso não encontrado
 */
router.delete("/:id", verifyJWT, isAdmin, deleteCurso);

export default router;
