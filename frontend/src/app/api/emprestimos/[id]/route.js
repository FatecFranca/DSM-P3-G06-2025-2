// app/api/emprestimos/[id]/route.js

export async function PUT(request, { params }) {
  try {
    // 1. O 'id' agora vem dos 'params' (da URL)
    const { id } = params;

    // 2. O restante dos dados vem do 'body'
    const body = await request.json();
    const { status, data_devolucao_real } = body;

    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return new Response(JSON.stringify({ error: "Token não fornecido" }), {
        status: 401,
      });
    }

    // 3. O 'id' é usado na URL do fetch para o backend
    const response = await fetch(`http://localhost:8080/emprestimos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      // 4. O 'id' não é mais enviado no body para o backend
      body: JSON.stringify({ status, data_devolucao_real }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error }), {
        status: response.status,
      });
    }

    return Response.json(data);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
