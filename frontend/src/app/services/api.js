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
      headers: config.headers,
    });
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const responseData = await response.json();

    console.log("Resposta recebida:", {
      status: response.status,
      data: responseData,
    });

    if (!response.ok) {
      throw new Error(responseData.error || "Erro na requisição");
    }

    return responseData;
  } catch (error) {
    console.error("Erro na requisição:", error);
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
    listar: () => request("/usuarios"),
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
    listar: () => request("/livros"),
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
    listar: () => request("/cursos", { isPublic: true }),
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
    listar: () => request("/exemplares"),
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
    listar: () => request("/emprestimos"),
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
    listar: () => request("/sugestoes"),
    obterPorId: (id) => request(`/sugestoes/${id}`),
    atualizar: (id, sugestaoData) =>
      request(`/sugestoes/${id}`, {
        method: "PUT",
        data: sugestaoData,
      }),
    excluir: (id) =>
      request(`/sugestoes/${id}`, {
        method: "DELETE",
      }),
  },
};
