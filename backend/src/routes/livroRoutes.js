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

// Rotas Públicas

/**
 * @swagger
 * /livros:
 *   get:
 *     summary: Listar todos os livros
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         description: Filtrar por título
 *       - in: query
 *         name: autor
 *         schema:
 *           type: string
 *         description: Filtrar por autor
 *       - in: query
 *         name: materia
 *         schema:
 *           type: string
 *         description: Filtrar por matéria
 *       - in: query
 *         name: palavras_chave
 *         schema:
 *           type: string
 *         description: Filtrar por palavra-chave
 *     responses:
 *       200:
 *         description: Lista de livros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   titulo:
 *                     type: string
 *                   autor:
 *                     type: string
 *                   editora:
 *                     type: string
 *                   edicao:
 *                     type: string
 *                   materia:
 *                     type: string
 *                   palavras_chave:
 *                     type: array
 *                     items:
 *                       type: string
 *                   curso:
 *                     type: object
 *                   disponibilidade:
 *                     type: boolean
 *       401:
 *         description: Não autorizado
 */
router.get("/", verifyJWT, getAllLivros);

// Rotas do Adiministrador

/**
 * @swagger
 * /livros/{id}:
 *   get:
 *     summary: Obter livro por ID (admin)
 *     tags: [Livros]
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
 *         description: Detalhes do livro
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 titulo:
 *                   type: string
 *                 autor:
 *                   type: string
 *                 editora:
 *                   type: string
 *                 edicao:
 *                   type: string
 *                 materia:
 *                   type: string
 *                 palavras_chave:
 *                   type: array
 *                   items:
 *                     type: string
 *                 curso:
 *                   type: object
 *                 exemplares:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Livro não encontrado
 */
router.get("/:id", verifyJWT, isAdmin, getLivroById);

/**
 * @swagger
 * /livros:
 *   post:
 *     summary: Criar novo livro (admin)
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - autor
 *               - editora
 *               - edicao
 *               - materia
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               editora:
 *                 type: string
 *               edicao:
 *                 type: string
 *               materia:
 *                 type: string
 *               palavras_chave:
 *                 type: array
 *                 items:
 *                   type: string
 *               curso_id:
 *                 type: string
 *               disponibilidade:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Livro criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.post("/", verifyJWT, isAdmin, createLivro);

/**
 * @swagger
 * /livros/{id}:
 *   put:
 *     summary: Atualizar livro (admin)
 *     tags: [Livros]
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
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               editora:
 *                 type: string
 *               edicao:
 *                 type: string
 *               materia:
 *                 type: string
 *               palavras_chave:
 *                 type: array
 *                 items:
 *                   type: string
 *               curso_id:
 *                 type: string
 *               disponibilidade:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Livro não encontrado
 */
router.put("/:id", verifyJWT, isAdmin, updateLivro);

/**
 * @swagger
 * /livros/{id}:
 *   delete:
 *     summary: Excluir livro (admin)
 *     tags: [Livros]
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
 *         description: Livro excluído com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Livro não encontrado
 */
router.delete("/:id", verifyJWT, isAdmin, deleteLivro);

export default router;
