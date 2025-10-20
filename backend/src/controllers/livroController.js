import prisma from "../database/client.js";

// Funções acessíveis a todos os usuários logados

// Obter todos os livros (com filtros de busca)
export const getAllLivros = async (req, res) => {
  const { titulo, autor, materia, palavras_chave } = req.query;

  try {
    const where = {};
    if (titulo) where.titulo = { contains: titulo, mode: "insensitive" };
    if (autor) where.autor = { contains: autor, mode: "insensitive" };
    if (materia) where.materia = { contains: materia, mode: "insensitive" };
    if (palavras_chave) where.palavras_chave = { has: palavras_chave };

    const livros = await prisma.livro.findMany({
      where,
      include: {
        curso: { select: { nome: true } },
        _count: { select: { exemplares: true } },
      },
      orderBy: {
        titulo: "asc",
      },
    });
    res.status(200).json(livros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Funções exclusivas para administradores

// Obter um livro por ID
export const getLivroById = async (req, res) => {
  const { id } = req.params;
  try {
    const livro = await prisma.livro.findUnique({
      where: { id },
      include: {
        curso: true,
        exemplares: true,
      },
    });

    if (livro) {
      res.status(200).json(livro);
    } else {
      res.status(404).json({ error: "Livro não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar um novo livro
export const createLivro = async (req, res) => {
  const {
    titulo,
    autor,
    editora,
    edicao,
    materia,
    palavras_chave,
    curso_id,
    disponibilidade,
  } = req.body;
  try {
    const novoLivro = await prisma.livro.create({
      data: {
        titulo,
        autor,
        editora,
        edicao,
        materia,
        palavras_chave,
        curso_id,
        disponibilidade,
        data_cadastro: new Date(), // Define a data de cadastro automaticamente
      },
    });
    res.status(201).json(novoLivro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar um livro
export const updateLivro = async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;
  try {
    const livroAtualizado = await prisma.livro.update({
      where: { id },
      data,
    });
    res.status(200).json(livroAtualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar um livro
export const deleteLivro = async (req, res) => {
  const { id } = req.params;
  try {
    // Para deletar um livro, primeiro precisamos remover suas dependências:
    // 1. Empréstimos associados a este livro
    await prisma.emprestimo.deleteMany({
      where: { livro_id: id },
    });
    // 2. Exemplares deste livro
    await prisma.exemplar.deleteMany({
      where: { id_livro: id },
    });

    // 3. Agora podemos deletar o livro
    await prisma.livro.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
