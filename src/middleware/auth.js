const jwt = require("jsonwebtoken");
const config = require("../../config");

function authmiddleware(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Autorização negada", token: "token" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: " Não Autorizado" });
    }

    // Verifique a permissão no token
    const permissao = decoded.permissao;

    if (permissao == 0) {
      console.log("administrador");
      // É um administrador
      req.session = decoded;
      req.isAdministrador = true;
      next();
    } else if (permissao == 1) {
      console.log("funcionario");
      // É um funcionario
      req.session = decoded;
      req.isFuncionario = true;
      next();
    } else if (permissao == 2) {
      console.log("professor");
      // É um professor
      req.session = decoded;
      req.isProfessor = true;
      next();
    } else if (permissao == 3) {
      console.log("aluno");
      // É um aluno
      req.session = decoded;
      req.isAluno = true;
      next();
    } else {
      return res.status(403).json({ message: "Permissão inválida" });
    }

    console.log("resultado:", decoded);
    req.session = decoded;
    next();
  });
}

module.exports = authmiddleware;

// if (permissao == 0)
// 0 = administrador
// else if(permissao == 1)
// 1 = cliente
// else if( permissao == 2)
// 2 = atendente
// para cada end point consulta, historico, agenda, remarcar, deletar,
// permissao para cada cliente, administrador, atendente
