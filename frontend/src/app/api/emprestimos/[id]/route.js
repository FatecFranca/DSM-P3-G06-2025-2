export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, data_devolucao_real } = body;

    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return new Response(JSON.stringify({ error: "Token não fornecido" }), {
        status: 401,
      });
    }

    const response = await fetch(`http://localhost:8080/emprestimos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
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
