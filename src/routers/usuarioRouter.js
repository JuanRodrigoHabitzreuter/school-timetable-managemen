
const express = require("express");
const ControllerUsuario = require("../controllers/usuarioController");
const authmiddleware = require("../middleware/auth.js");
const controllerUsuario = new ControllerUsuario();

const router = express.Router();

router.post("/api/usuario/login", controllerUsuario.Login);
router.get("/api/usuario/:id", authmiddleware, controllerUsuario.Individuo);
router.get("/api/usuario", authmiddleware, controllerUsuario.Listar);
router.post("/api/usuario", authmiddleware, controllerUsuario.Registrar);
router.put("/api/usuario/:id", authmiddleware, controllerUsuario.Atualizar);
router.delete("/api/usuario/:id", authmiddleware, controllerUsuario.Remover);

module.exports = router;
