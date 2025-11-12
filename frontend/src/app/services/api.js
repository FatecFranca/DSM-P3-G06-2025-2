const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt_token");
  }
  return null;
};

const getHeaders = (isPublic = false) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (!isPublic) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

async function request(endpoint, options = {}) {
  const { method = "GET", data, isPublic = false } = options;

  const config = {
    method,
    headers: getHeaders(isPublic),
  };

  if (data) {
    config.body = JSON.stringify(data);
    console.log("Enviando requisição:", {
      endpoint,
      method,
      data,
    });
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 204) {
      console.log("Resposta recebida (204 No Content):", {
        status: response.status,
      });
      return null;
    }

    if (!response.ok) {
      let errorData = {
        error: `Erro ${response.status}: ${response.statusText}`,
      };

      try {
        errorData = await response.json();
      } catch (e) {}

      console.error("Erro na resposta:", {
        status: response.status,
        data: errorData,
      });

      throw new Error(errorData.error || `Erro ${response.status}`);
    }

    const responseData = await response.json();

    console.log("Resposta recebida:", {
      status: response.status,
      data: responseData,
    });

    return responseData;
  } catch (error) {
    console.error("Erro na requisição (fetch/catch):", error);
    throw error;
  }
}

export const api = {
  // === Rotas de Autenticação (Públicas) ===
  auth: {
    login: (credentials) =>
      request("/usuarios/login", {
        method: "POST",
        data: credentials,
        isPublic: true,
      }),
    cadastro: (userData) =>
      request("/usuarios/cadastro", {
        method: "POST",
        data: userData,
        isPublic: true,
      }),
  },

  // === Rotas de Usuários (Admin) ===
  usuarios: {
    listar: (params) =>
      request(`/usuarios${params ? `?${new URLSearchParams(params)}` : ""}`),
    obterPorId: (id) => request(`/usuarios/${id}`),
    criar: (userData) =>
      request("/usuarios", {
        method: "POST",
        data: userData,
      }),
    atualizar: (id, userData) =>
      request(`/usuarios/${id}`, {
        method: "PUT",
        data: userData,
      }),
    excluir: (id) =>
      request(`/usuarios/${id}`, {
        method: "DELETE",
      }),
  },

  // === Rotas de Livros ===
  livros: {
    listar: (params) =>
      request(`/livros${params ? `?${new URLSearchParams(params)}` : ""}`),
    obterPorId: (id) => request(`/livros/${id}`),
    criar: (livroData) =>
      request("/livros", {
        method: "POST",
        data: livroData,
      }),
    atualizar: (id, livroData) =>
      request(`/livros/${id}`, {
        method: "PUT",
        data: livroData,
      }),
    excluir: (id) =>
      request(`/livros/${id}`, {
        method: "DELETE",
      }),
  },

  // === Rotas de Cursos ===
  cursos: {
    listar: (params) =>
      request(`/cursos${params ? `?${new URLSearchParams(params)}` : ""}`),
    obterPorId: (id) => request(`/cursos/${id}`),
    criar: (cursoData) =>
      request("/cursos", {
        method: "POST",
        data: cursoData,
      }),
    atualizar: (id, cursoData) =>
      request(`/cursos/${id}`, {
        method: "PUT",
        data: cursoData,
      }),
    excluir: (id) =>
      request(`/cursos/${id}`, {
        method: "DELETE",
      }),
  },

  // === Rotas de Exemplares ===
  exemplares: {
    listar: (params) =>
      request(`/exemplares${params ? `?${new URLSearchParams(params)}` : ""}`),
    obterPorId: (id) => request(`/exemplares/${id}`),
    criar: (exemplarData) =>
      request("/exemplares", {
        method: "POST",
        data: exemplarData,
      }),
    atualizar: (id, exemplarData) =>
      request(`/exemplares/${id}`, {
        method: "PUT",
        data: exemplarData,
      }),
    excluir: (id) =>
      request(`/exemplares/${id}`, {
        method: "DELETE",
      }),
  },

  // === Rotas de Empréstimos ===
  emprestimos: {
    listar: (params) =>
      request(`/emprestimos${params ? `?${new URLSearchParams(params)}` : ""}`),
    obterPorId: (id) => request(`/emprestimos/${id}`),
    criar: (emprestimoData) =>
      request("/emprestimos", {
        method: "POST",
        data: emprestimoData,
      }),
    atualizar: (id, emprestimoData) =>
      request(`/emprestimos/${id}`, {
        method: "PUT",
        data: emprestimoData,
      }),
    excluir: (id) =>
      request(`/emprestimos/${id}`, {
        method: "DELETE",
      }),
  },

  // === Rotas de Sugestões ===
  sugestoes: {
    criar: (sugestaoData) =>
      request("/sugestoes", {
        method: "POST",
        data: sugestaoData,
      }),

    listar: (params) =>
      request(`/sugestoes${params ? `?${new URLSearchParams(params)}` : ""}`),

    obterPorId: (id) => request(`/sugestoes/${id}/status`),
    atualizar: (id, sugestaoData) =>
      request(`/sugestoes/${id}/status`, {
        method: "PATCH",
        data: sugestaoData,
      }),
    excluir: (id) =>
      request(`/sugestoes/${id}`, {
        method: "DELETE",
      }),
  },
};
