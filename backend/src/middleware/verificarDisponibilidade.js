import prisma from "../database/client.js";

export const verificarDisponibilidadeExemplar = async (req, res, next) => {
  const { exemplarId } = req.body;

  try {
    const exemplar = await prisma.exemplar.findFirst({
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

    if (!exemplar) {
      return res.status(400).json({
        error: "Exemplar não encontrado ou não disponível para empréstimo",
      });
    }

    const emprestimosAtivos = await prisma.emprestimo.count({
      where: {
        usuario_id: req.userId,
        status: { in: ["ativo", "atrasado"] },
      },
    });

    if (emprestimosAtivos >= 3) {
      return res.status(400).json({
        error: "Você já atingiu o limite máximo de 3 empréstimos ativos",
      });
    }

    req.exemplar = exemplar;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
