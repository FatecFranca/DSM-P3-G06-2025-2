import { PrismaClient } from "../generated/prisma/default.js";

// Cria o cliente Prisma com opção de exibir no terminal todas as consultas enviadas ao banco de dados
const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});

// Exibe no terminal todas as instruções de consulta enviadas ao servidor MongoDB
prisma.$on("query", (event) => {
  console.log("-".repeat(80));
  console.log(event.query);
  if (event.params) console.log("PARAMS:", event.params);
});

export default prisma;
