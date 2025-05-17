const ServicoUsuario = require("../services/usuarioService");
const servico = new ServicoUsuario();

class ControllerUsuario {
  async Login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }

    try {
      const usuario = await servico.Login(email, senha); // novo método no serviço

      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          nome: usuario.nome,
          permissao: usuario.permissao,
        },
        config.secret,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Login realizado com sucesso",
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone,
          permissao: usuario.permissao,
        },
      });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(401).json({ message: error.message || "E-mail ou senha inválidos" });
    }
  }

  async Individuo(req, res) {
    try {
      console.log(req.params.id);
      const result = await servico.Individuo(req.params.id);
      res.status(200).json({
        permissao: usuario.permissao,
        email: usuario.email,
        senha: usuario.senha,
        clienteid: usuario.cliente.map((usuario) => {
          return {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
          };
        }),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }

  async Listar(_, res) {
    try {
      const result = await servico.Listar();
      res.status(200).json({
        usuarios: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }

  async Registrar(req, res) {
    try {
      const result = await servico.Registrar(req.body.usuario);
      res.status(201).json({
        message: "Usuario criado com sucesso",
        usuario: result, // Adicione o objeto cliente ao JSON de resposta
      });
    } catch (error) {
      console.error(error); // Use console.error para imprimir erros
      res.status(500).json({ message: error.message }); // Envie o erro como resposta
    }
  }

  async Atualizar(req, res) {
    try {
      const result = await servico.Atualizar(req.params.id, req.body.usuario);
      res.status(200).json({
        message: "Usuario atualizado com sucesso",
        usuarios: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }

  async Remover(req, res) {
    try {
      await servico.Delete(req.params.id);
      res.status(204).json({
        message: "Usuario deletado com sucesso",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
}

module.exports = ControllerUsuario;
