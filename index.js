const express = require("express");
//metodo
const app = express();
const usuarioRouter = require("./src/routers/usuarioRouter");
const authmiddleware = require("./src/middleware/auth");
const jwt = require("jsonwebtoken");

app.use(express.json()); // Necessário para lidar com JSON no body das requisições
// Middleware para analisar corpos de requisição URL-encoded (adicione este por precaução)
app.use(express.urlencoded({ extended: true }));
app.use(usuarioRouter);

app.post("/consulta", authmiddleware, (req, res) => {
  if (req.isAdministrador || req.isFuncionario) {
    // Lógica para a rota /consulta
  } else {
    res.status(403).json({ message: "Permissão insuficiente" });
  }
});

app.get("/historico", authmiddleware, (req, res) => {
  if (
    req.isAdministrador ||
    req.isFuncionario ||
    req.isProfessor ||
    req.isAluno
  ) {
    // Lógica para a rota /historico
  } else {
    res.status(403).json({ message: "Permissão insuficiente" });
  }
});

app.post("/agenda", authmiddleware, (req, res) => {
  if (req.isUsuario) {
    // Lógica para a rota /agenda
  } else {
    res.status(403).json({ message: "Permissão insuficiente" });
  }
});

app.put("/remarcar", authmiddleware, (req, res) => {
  if (req.isUsuario) {
    // Lógica para a rota /remarcar
  } else {
    res.status(403).json({ message: "Permissão insuficiente" });
  }
});

app.delete("/deletar", authmiddleware, (req, res) => {
  if (req.isAdministrador) {
    // Lógica para a rota /deletar
  } else {
    res.status(403).json({ message: "Permissão insuficiente" });
  }
});
// Definindo a porta que o servidor vai ouvir
app.listen(3080, () => {
  console.log("Servidor rodando na porta 3080");
});

//config.js → database.js → models/ → repositories/ → services/ → controllers/ → routers/ → index.js`
