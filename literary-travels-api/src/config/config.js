require('dotenv').config();

const dbConfig = {
  use_env_variable: 'DATABASE_URL_DIRECT',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
};

module.exports = {
  development: dbConfig,
  production: dbConfig
};
