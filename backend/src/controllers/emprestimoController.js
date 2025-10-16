import prisma from "../database/client.js";

// Funções acessíveis a todos os usuários logados

// Criar um novo empréstimo
export const createEmprestimo = async (req, res) => {
  const { exemplarId, data_devolucao_prevista } = req.body;
  const usuario_id = req.userId;

  try {
    // 1. Verificar se o exemplar está disponível
    const exemplarDisponivel = await prisma.exemplar.findFirst({
      where: {
        id: exemplarId,
        emprestimos: {
          none: {
            status: { in: ["ativo", "atrasado"] },
          },
        },
      },
      include: {
        livro: true,
      },
    });

    if (!exemplarDisponivel) {
      return res
        .status(400)
        .json({ error: "Este exemplar não está disponível para empréstimo." });
    }

    // 2. Criar o empréstimo
    const novoEmprestimo = await prisma.emprestimo.create({
      data: {
        usuario_id,
        exemplarId,
        livro_id: exemplarDisponivel.livro.id,
        data_emprestimo: new Date(),
        data_devolucao_prevista: new Date(data_devolucao_prevista),
        status: "ativo",
      },
    });

    res.status(201).json(novoEmprestimo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter os empréstimos do usuário logado
export const getMeusEmprestimos = async (req, res) => {
  const usuario_id = req.userId;
  try {
    const emprestimos = await prisma.emprestimo.findMany({
      where: { usuario_id },
      include: {
        livro: { select: { id: true, titulo: true, autor: true } },
        exemplar: { select: { num_exemplar: true } },
      },
      orderBy: { data_emprestimo: "desc" },
    });
    res.status(200).json(emprestimos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Funções exclusivas para administradores

// Obter todos os empréstimos
export const getAllEmprestimos = async (req, res) => {
  const { usuario_id, exemplarId, status } = req.query;
  try {
    const where = {};
    if (usuario_id) where.usuario_id = usuario_id;
    if (exemplarId) where.exemplarId = exemplarId;
    if (status) where.status = status;

    const emprestimos = await prisma.emprestimo.findMany({
      where,
      include: {
        usuario: { select: { nome: true, email: true } },
        livro: { select: { titulo: true } },
        exemplar: { select: { num_exemplar: true } },
      },
      orderBy: { data_emprestimo: "desc" },
    });
    res.status(200).json(emprestimos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um empréstimo
export const updateEmprestimo = async (req, res) => {
  const { id } = req.params;
  const { status, data_devolucao_real } = req.body;
  try {
    const data = { status };

    if (status === "concluido") {
      data.data_devolucao_real = data_devolucao_real
        ? new Date(data_devolucao_real)
        : new Date();
    }

    const emprestimoAtualizado = await prisma.emprestimo.update({
      where: { id },
      data,
    });
    res.status(200).json(emprestimoAtualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar um registro de empréstimo
export const deleteEmprestimo = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.emprestimo.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
