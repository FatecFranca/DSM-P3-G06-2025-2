export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const livroId = searchParams.get("livroId");
    const disponivel = searchParams.get("disponivel") === "true";
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return new Response(JSON.stringify({ error: "Token não fornecido" }), {
        status: 401,
      });
    }

    let url = `http://localhost:8080/exemplares?livroId=${livroId}`;
    if (disponivel) {
      url += "&disponivel=true";
    }

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
