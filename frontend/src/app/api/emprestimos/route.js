export async function POST(request) {
  try {
    const body = await request.json();
    const { exemplarId, data_devolucao_prevista } = body;
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return new Response(JSON.stringify({ error: "Token não fornecido" }), {
        status: 401,
      });
    }

    const response = await fetch(
      "https://openpages-backend.onrender.com/emprestimos",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ exemplarId, data_devolucao_prevista }),
      }
    );

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

export async function GET(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    const { searchParams } = new URL(request.url);
    const meusEmprestimos = searchParams.get("meus") === "true";

    if (!token) {
      return new Response(JSON.stringify({ error: "Token não fornecido" }), {
        status: 401,
      });
    }

    const url = meusEmprestimos
      ? "https://openpages-backend.onrender.com/emprestimos/meusEmprestimos"
      : "https://openpages-backend.onrender.com/emprestimos";

    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
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
