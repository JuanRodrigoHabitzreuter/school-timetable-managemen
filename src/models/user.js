const { DataTypes } = require("sequelize");
const conexao = require("../../database");

const User = conexao.define(
  "User", 
    {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },  
    nome: {
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },   
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo_Usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3, 
    },
    matricula: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);

module.exports = User;