const { DataTypes } = require("sequelize");
const conexao = require("../../database");

console.log("Iniciando definição do modelo Usuario...");
const Usuario = conexao.define(
  "usuarios",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    permissao: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nome: {
      field: "nome",
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      field: "email",
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefone: {
      field: "telefone",
      type: DataTypes.STRING,
      allowNull: false,
    },
    senha: {
      field: "senha",
      type: DataTypes.STRING,
      unique: true, // Essa opção garante unicidade
      allowNull: false,
    },
    usuarioId: {
      field: "usuario_id",
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

// Relacionamento
if (Usuario) {
  //Usuario.hasOne(Usuario, { foreignKey: 'usuarioId' });
  Usuario.belongsTo(Usuario, { as: "referencia", foreignKey: "usuarioId" });
  console.log("Relacionamento Permissao -> Usuario definido!");
} else {
  console.error("Erro: Modelo permissao não encontrado!");
}

module.exports = Usuario;
