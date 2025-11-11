import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    if (!id) {
      return NextResponse.json(
        { error: "ID do livro não fornecido" },
        { status: 400 }
      );
    }

    const token = request.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { error: "Não autorizado. Token não fornecido." },
        { status: 401 }
      );
    }

    const response = await fetch(`http://localhost:8080/livros/${id}`, {
      method: "GET",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data.message ||
            data.error ||
            "Erro ao buscar dados do livro no backend",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na API route /api/livros/[id]:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor Next.js", details: error.message },
      { status: 500 }
    );
  }
}
