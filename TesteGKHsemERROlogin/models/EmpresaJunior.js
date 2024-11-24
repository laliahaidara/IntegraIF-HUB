const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmpresaJunior = sequelize.define('EmpresaJunior', {
  CNPJ: {
    type: DataTypes.STRING(14),
    primaryKey: true,
    allowNull: false,
  },
  Nome: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  Status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  DataCriada: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  DataEncerrada: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false, // coloquei pra nao add createdAt e updatedAt automaticamente
});

module.exports = EmpresaJunior;
