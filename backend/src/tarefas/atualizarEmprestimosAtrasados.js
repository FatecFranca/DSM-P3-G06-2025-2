import prisma from "../database/client.js";

export const checkOverdueLoans = async () => {
  console.log("CRON: Rodando verificação de empréstimos atrasados...");
  try {
    const { count } = await prisma.emprestimo.updateMany({
      where: {
        status: "ativo",
        data_devolucao_prevista: {
          lt: new Date(),
        },
      },
      data: {
        status: "atrasado",
      },
    });
    if (count > 0) {
      console.log(
        `CRON: ${count} empréstimos foram atualizados para 'atrasado'.`
      );
    } else {
      console.log("CRON: Nenhum empréstimo atrasado encontrado.");
    }
  } catch (error) {
    console.error("CRON: Erro ao atualizar empréstimos atrasados:", error);
  }
};
