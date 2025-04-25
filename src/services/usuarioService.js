const RepositorieUsuario = require("../repositories/usuarioRepositorie");
const repositorio = new RepositorieUsuario();

class ServicoUsuario {
  VerficarUsuario(usuario) {
    if (!usuario) {
      throw new Error("Não foi enviada a usuario para adicionar");
    } else if (!usuario.email) {
      throw new Error("Não foi enviado o email de usuario");
    } else if (!usuario.senha) {
      throw new Error("Não foi enviado o senha de usuario");
    }
    return true;
  }

  async Individuo(id, transaction) {
    console.log("enviando para o repositorio");
    return repositorio.Individuo(id, transaction);
  }

  async PegarUmUsuario(email) {
    return repositorio.pegarUmUsuario(email);
  }

  async TodosUsuarios(transaction) {
    return repositorio.todosUsuarios(transaction);
  }

  async RegistrarUsuario(usuario, transaction) {
    this.VerficarUsuario(usuario, transaction);

    return repositorio.registrarUsuario(usuario, transaction);
  }

  async AtualizarUsuario(id, usuario, transaction) {
    if (!id) {
      throw new Error(
        "Não foi enviada o identificador da usuario para alterar"
      );
    }
    this.VerficarUsuario(usuario);

    return repositorio.atualizarUsuario(id, usuario, transaction);
  }

  async RemoverUsuario(id, transaction) {
    return repositorio.removerUsuario(id, transaction);
  }
}

module.exports = ServicoUsuario;
