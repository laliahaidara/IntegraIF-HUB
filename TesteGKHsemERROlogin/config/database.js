const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ej', 'root', '', {
  host: 'localhost', 
  dialect: 'mysql', 
  logging: false,
});

module.exports = sequelize;
