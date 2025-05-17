const { DataTypes } = require("sequelize");
const conexao = require("../../database");

const Usuario = conexao.define(
  "Usuario",  // nome do model (sempre singular, convenção)
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },  
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },   
       senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo_Usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    matricula: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    
  },
  {
    tableName: "usuarios", // nome exato da tabela no banco
    timestamps: false,
  }
);

// Definindo relacionamento (auto-relacionamento)
//Usuario.belongsTo(Usuario, { as: "referencia", foreignKey: "usuario_id" });

module.exports = Usuario;

//referenciar dentro da classe aluno
/*usuario_id: {  // aqui usa o mesmo nome da coluna no banco
      type: DataTypes.INTEGER,
      allowNull: true, // Se pode ser nulo (ex: usuário raiz)
      references: {
        model: "usuarios", // nome exato da tabela no banco
        key: "id",
      },
    },*/