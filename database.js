const { Sequelize } = require("sequelize");
const config = require("./config");

const conexao = new Sequelize(config.development);

conexao
  .sync({ alter: true })
  //conexao.sync({force: true}) para forçar a criação do banco de dados
  .then(() => {
    console.log("Conectado ao banco com sucesso!");
  })
  .catch((error) => {
    console.log("Não conectou ao banco de dados", error);
  });

module.exports = conexao;
