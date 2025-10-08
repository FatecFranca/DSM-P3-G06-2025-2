import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ error: "Erro no formato do token." });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Token mal formatado." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido ou expirado." });
    }

    req.userId = decoded.id;
    req.userPerfil = decoded.perfil;
    return next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.userPerfil !== "admin") {
    return res
      .status(403)
      .json({ error: "Acesso negado. Rota exclusiva para administradores." });
  }
  return next();
};
