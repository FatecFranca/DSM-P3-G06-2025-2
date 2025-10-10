import prisma from "../database/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Login (Público)
export const login = async (req, res) => {
  const { nome, senha } = req.body;
  try {
    const usuario = await prisma.usuario.findUnique({ where: { nome } });
    if (!usuario) {
      return res.status(401).json({ error: "Usuário ou senha inválidos." });
    }

    if (!(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ error: "Usuário ou senha inválidos." });
    }

    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    usuario.senha = undefined;
    res.status(200).json({ usuario, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Funções exclusivas para Administradores

// Criar novo usuário
export const createUsuario = async (req, res) => {
  const { nome, senha, perfil, curso_id } = req.body;
  try {
    const senhaHash = await bcrypt.hash(senha, 8);
    const novoUsuario = await prisma.usuario.create({
      // O perfil 'admin' ou 'usuario' será definido pelo admin no corpo da requisição
      data: { nome, email, senha: senhaHash, perfil, curso_id },
    });
    novoUsuario.senha = undefined;
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obter todos os usuários
export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nome: true, perfil: true, curso: true },
    });
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter um usuário por ID
export const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        perfil: true,
        curso_id: true,
        curso: true,
        sugestoes: true,
        emprestimos: true,
      },
    });

    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um usuário
export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, senha, perfil, curso_id } = req.body;
  try {
    const data = { nome, perfil, curso_id };
    // Se uma nova senha for fornecida, criptografa antes de atualizar
    if (senha) {
      data.senha = await bcrypt.hash(senha, 8);
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id },
      data,
    });

    usuarioAtualizado.senha = undefined;
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar um usuário
export const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    // Antes de deletar o usuário, é preciso remover as suas dependências
    await prisma.sugestaoDeLivro.deleteMany({
      where: { usuario_id: id },
    });
    await prisma.emprestimo.deleteMany({
      where: { usuario_id: id },
    });

    // Agora pode deletar o usuário
    await prisma.usuario.delete({
      where: { id },
    });

    res.status(204).send(); // 204 No Content indica sucesso na exclusão
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
