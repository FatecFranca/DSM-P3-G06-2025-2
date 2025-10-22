import prisma from "../database/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Login
export const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    if (!email || !senha) {
      console.log("Validação falhou - campos faltando:", {
        email: !email,
        senha: !senha,
      });
      return res
        .status(400)
        .json({ error: "E-mail e senha são obrigatórios." });
    }

    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [{ email: email }, { email: email.toLowerCase() }],
      },
    });

    if (!usuario) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Remove a senha antes de enviar
    delete usuario.senha;

    // Retorna um objeto com a estrutura esperada pelo frontend
    res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        curso_id: usuario.curso_id,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Ocorreu um erro ao tentar fazer login." });
  }
};

// Cadastro público de usuário
export const cadastro = async (req, res) => {
  const { nome, email, senha, curso_id } = req.body;
  try {
    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Nome, e-mail e senha são obrigatórios." });
    }

    const userExists = await prisma.usuario.findFirst({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ error: "Este e-mail já está em uso." });
    }

    const senhaHash = await bcrypt.hash(senha, 8);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        perfil: "usuario",
        curso_id: curso_id || undefined,
      },
    });

    novoUsuario.senha = undefined;
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ error: "Ocorreu um erro ao registrar o usuário." });
  }
};

// Funções exclusivas para Administradores

// Criar novo usuário
export const createUsuario = async (req, res) => {
  const { nome, email, senha, perfil, curso_id } = req.body;
  try {
    const senhaHash = await bcrypt.hash(senha, 8);
    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash, perfil, curso_id },
    });
    novoUsuario.senha = undefined;
    res.status(201).json(novoUsuario);
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(400).json({ error: "Este e-mail já está em uso." });
    }
    res.status(400).json({ error: error.message });
  }
};

// Listar todos os usuários
export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        curso: { select: { id: true, nome: true } },
      },
      orderBy: { nome: "asc" },
    });
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter detalhes de um usuário por ID
export const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        curso: true,
        _count: { select: { emprestimos: true, sugestoes: true } },
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

// Atualizar um usuário existente
export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, perfil, curso_id } = req.body;
  try {
    const data = { nome, email, perfil, curso_id };

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
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(400).json({ error: "Este e-mail já está em uso." });
    }
    res.status(400).json({ error: error.message });
  }
};

// Deletar um usuário
export const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.$transaction([
      prisma.sugestaoDeLivro.deleteMany({ where: { usuario_id: id } }),
      prisma.emprestimo.deleteMany({ where: { usuario_id: id } }),
      prisma.usuario.delete({ where: { id } }),
    ]);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Ocorreu um erro ao deletar o usuário." });
  }
};
