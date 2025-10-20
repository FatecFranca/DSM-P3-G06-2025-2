import express from "express";
import {
  login,
  cadastro,
  createUsuario,
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuarioController.js";
import { verifyJWT, isAdmin } from "../middleware/autenticacao.js";

const router = express.Router();

// Rotas Públicas

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do usuário
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     perfil:
 *                       type: string
 *                     curso_id:
 *                       type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", login);

/**
 * @swagger
 * /usuarios/cadastro:
 *   post:
 *     summary: Cadastrar novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - senha
 *               - curso_id
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do usuário
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *               curso_id:
 *                 type: string
 *                 description: ID do curso do usuário
 *     responses:
 *       201:
 *         description: Cadastro realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 perfil:
 *                   type: string
 *                   enum: [usuario]
 *                 curso_id:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Nome de usuário já existe
 */
router.post("/cadastro", cadastro);

// Rotas do Adiministrador

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Criar novo usuário (admin)
 *     tags: [Usuários]
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
 *               - senha
 *               - perfil
 *             properties:
 *               nome:
 *                 type: string
 *               senha:
 *                 type: string
 *               perfil:
 *                 type: string
 *                 enum: [admin, usuario]
 *               curso_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.post("/", verifyJWT, isAdmin, createUsuario);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar todos os usuários (admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
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
 *                   perfil:
 *                     type: string
 *                   curso:
 *                     type: object
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.get("/", verifyJWT, isAdmin, getAllUsuarios);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obter usuário por ID (admin)
 *     tags: [Usuários]
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
 *         description: Detalhes do usuário
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/:id", verifyJWT, isAdmin, getUsuarioById);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualizar usuário (admin)
 *     tags: [Usuários]
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
 *               senha:
 *                 type: string
 *               perfil:
 *                 type: string
 *               curso_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
router.put("/:id", verifyJWT, isAdmin, updateUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Excluir usuário (admin)
 *     tags: [Usuários]
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
 *         description: Usuário excluído com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
router.delete("/:id", verifyJWT, isAdmin, deleteUsuario);

export default router;
