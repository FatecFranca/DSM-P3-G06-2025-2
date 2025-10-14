import prisma from "../database/client.js";

// Funções acessíveis a todos os usuários logados

// Obter todos os exemplares de um livro específico
export const getAllExemplares = async (req, res) => {
  const { livro_id } = req.query; // Filtro por ID do livro via query string

  if (!livro_id) {
    return res.status(400).json({ error: "O ID do livro é obrigatório." });
  }

  try {
    const exemplares = await prisma.exemplar.findMany({
      where: { id_livro: livro_id },
      include: {
        livro: {
          select: { titulo: true },
        },
        // Inclui empréstimos para verificar a disponibilidade
        emprestimos: {
          where: {
            status: { in: ["ativo", "atrasado"] },
          },
        },
      },
      orderBy: {
        num_exemplar: "asc",
      },
    });

    // Adiciona um campo virtual "disponivel" para facilitar o frontend
    const exemplaresComStatus = exemplares.map((ex) => ({
      ...ex,
      disponivel: ex.emprestimos.length === 0,
    }));

    res.status(200).json(exemplaresComStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Funções exclusivas para administradores

// Criar um novo exemplar para um livro
export const createExemplar = async (req, res) => {
  const { id_livro, num_exemplar } = req.body;
  try {
    const novoExemplar = await prisma.exemplar.create({
      data: { id_livro, num_exemplar },
    });
    res.status(201).json(novoExemplar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar um exemplar (ex: mudar o número)
export const updateExemplar = async (req, res) => {
  const { id } = req.params;
  const { num_exemplar } = req.body;
  try {
    const exemplarAtualizado = await prisma.exemplar.update({
      where: { id },
      data: { num_exemplar },
    });
    res.status(200).json(exemplarAtualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar um exemplar
export const deleteExemplar = async (req, res) => {
  const { id } = req.params;
  try {
    // Verifica se o exemplar está em um empréstimo ativo
    const emprestimosAtivos = await prisma.emprestimo.count({
      where: {
        exemplarId: id,
        status: { in: ["ativo", "atrasado"] },
      },
    });

    if (emprestimosAtivos > 0) {
      return res.status(400).json({
        error:
          "Não é possível deletar um exemplar que está atualmente emprestado.",
      });
    }

    await prisma.exemplar.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
