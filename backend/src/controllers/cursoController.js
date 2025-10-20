import prisma from "../database/client.js";

// Funções acessíveis a todos os usuários logados

// Obter todos os cursos
export const getAllCursos = async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany({
      include: {
        _count: {
          // Inclui a contagem de usuários e livros em cada curso
          select: { usuarios: true, livros: true },
        },
      },
    });
    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Funções exclusivas para administradores

// Obter um curso por ID
export const getCursoById = async (req, res) => {
  const { id } = req.params;
  try {
    const curso = await prisma.curso.findUnique({
      where: { id },
      include: {
        usuarios: { select: { id: true, nome: true, email: true } }, // Retorna dados básicos dos usuários
        livros: true,
      },
    });

    if (curso) {
      res.status(200).json(curso);
    } else {
      res.status(404).json({ error: "Curso não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar um novo curso
export const createCurso = async (req, res) => {
  const { nome, descricao } = req.body;
  try {
    const novoCurso = await prisma.curso.create({
      data: { nome, descricao },
    });
    res.status(201).json(novoCurso);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar um curso
export const updateCurso = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  try {
    const cursoAtualizado = await prisma.curso.update({
      where: { id },
      data: { nome, descricao },
    });
    res.status(200).json(cursoAtualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar um curso
export const deleteCurso = async (req, res) => {
  const { id } = req.params;
  try {
    // Verifica se existem usuários ou livros associados ao curso
    const curso = await prisma.curso.findUnique({
      where: { id },
      include: { _count: { select: { usuarios: true, livros: true } } },
    });

    if (curso._count.usuarios > 0 || curso._count.livros > 0) {
      return res.status(400).json({
        error:
          "Não é possível deletar o curso. Ele possui usuários ou livros associados.",
      });
    }

    await prisma.curso.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
