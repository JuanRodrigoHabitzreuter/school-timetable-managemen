const Usuario = require("../models/usuarioModels");
const bcrypt = require("bcrypt");

class RepositorieUsuario {
  async Individuo(transaction) {
    return Usuario.findOne({
      where: { email, senha },
      transaction,
      include: "usuarios",
    });
  }

  async pegarUmUsuario(email) {
    return Usuario.findOne({
      where: { email },
    });
  }

  async todosUsuarios(transaction) {
    return Usuario.findAll({ transaction });
  }

  async registrarUsuario(usuario, transaction) {
    const hashSenha = await bcrypt.hash(usuario.senha, 10);
    usuario.senha = hashSenha;
    const result = await Usuario.create(usuario, { transaction });
    console.log(result);

    return result;
  }

  async atualizarUsuario(/*id,*/ usuario, transaction) {
    const hashSenha = await bcrypt.hash(usuario.senha, { transaction });

    usuario.senha = hashSenha;
    const result = await Usuario.update(usuario, { transaction });

    return result;
  }

  async removerUsuario(id, transaction) {
    return Usuario.destroy({
      where: { id },
      transaction,
    });
  }
}

module.exports = RepositorieUsuario;
