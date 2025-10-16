import prisma from "../database/client.js";

// Funções acessíveis a todos os usuários logados

// Criar uma nova sugestão de livro
export const createSugestao = async (req, res) => {
  const { livro_sugerido, autor, editora, motivo, curso_id } = req.body;
  const usuario_id = req.userId;

  try {
    const novaSugestao = await prisma.sugestaoDeLivro.create({
      data: {
        usuario_id,
        livro_sugerido,
        autor,
        editora,
        motivo,
        curso_id,
        status: "pendente",
        data_sugestao: new Date(),
      },
    });
    res.status(201).json(novaSugestao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Funções exclusivas para administradores

// Listar todas as sugestões (com filtro por status)
export const getAllSugestoes = async (req, res) => {
  const { status } = req.query;
  try {
    const where = {};
    if (status) where.status = status; // Filtra por 'pendente', 'aprovada' ou 'rejeitada'

    const sugestoes = await prisma.sugestaoDeLivro.findMany({
      where,
      include: {
        usuario: { select: { nome: true, email: true } },
        curso: { select: { nome: true } },
      },
      orderBy: {
        data_sugestao: "desc",
      },
    });
    res.status(200).json(sugestoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar o status de uma sugestão (aceitar/rejeitar)
export const updateSugestaoStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Espera receber 'aprovada' ou 'rejeitada'

  if (!["aprovada", "rejeitada"].includes(status)) {
    return res
      .status(400)
      .json({ error: "Status inválido. Use 'aprovada' ou 'rejeitada'." });
  }

  try {
    const sugestaoAtualizada = await prisma.sugestaoDeLivro.update({
      where: { id },
      data: { status },
    });
    res.status(200).json(sugestaoAtualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar uma sugestão
export const deleteSugestao = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.sugestaoDeLivro.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
