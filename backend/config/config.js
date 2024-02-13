var fs = require('fs');

const config = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD || fs.readFileSync('/secrets/user', 'utf8'),
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    seederStorage: 'sequelize',
    operatorsAliases: '0',
    logging: console.log,
  },
  test: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.TESTS_MYSQL_HOST,
    dialect: 'mysql',
    seederStorage: 'sequelize',
    operatorsAliases: '0',
    logging: false,
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD || fs.readFileSync('/secrets/user', 'utf8'),
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    seederStorage: 'sequelize',
    operatorsAliases: '0',
    logging: false,
  },
};

module.exports = config;
