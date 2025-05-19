const jwt = require("jsonwebtoken");
const config = require("../../config");

function authmiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Autorização negada" });
  }

  // Extract the token from "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: " Não Autorizado" });
    }

    // Verifique a permissão no token
    const permissao = decoded.permissao;

    if (permissao == 0) {
      req.session = decoded;
      req.isAdministrador = true;
      next();
    } else if (permissao == 1) {
      req.session = decoded;
      req.isFuncionario = true;
      next();
    } else if (permissao == 2) {
      req.session = decoded;
      req.isProfessor = true;
      next();
    } else if (permissao == 3) {
      req.session = decoded;
      req.isAluno = true;
      next();
    } else {
      return res.status(403).json({ message: "Permissão inválida" });
    }
  });
}

module.exports = authmiddleware;