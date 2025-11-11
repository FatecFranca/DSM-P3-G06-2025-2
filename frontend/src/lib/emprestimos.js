// Função para criar um novo empréstimo
export const solicitarEmprestimo = async (
  exemplarId,
  dataDevolucaoPrevista
) => {
  try {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      throw new Error("Você precisa estar logado para solicitar empréstimos");
    }

    const response = await fetch("/api/emprestimos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        exemplarId,
        data_devolucao_prevista: dataDevolucaoPrevista,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Erro ao solicitar empréstimo");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message ||
        "Não foi possível processar sua solicitação. Tente novamente mais tarde."
    );
  }
};

// Função para listar os empréstimos do usuário
export const listarMeusEmprestimos = async () => {
  try {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    const response = await fetch("/api/emprestimos/meusEmprestimos", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao listar empréstimos");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Função para listar todos os empréstimos (admin)
export const listarTodosEmprestimos = async () => {
  try {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    const response = await fetch("/api/emprestimos", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao listar empréstimos");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Função para atualizar o status de um empréstimo (admin)
export const atualizarEmprestimo = async (id, status) => {
  try {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    const data = {
      status,
      data_devolucao_real:
        status === "concluido" ? new Date().toISOString() : undefined,
    };

    const response = await fetch(`/api/emprestimos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao atualizar empréstimo");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
