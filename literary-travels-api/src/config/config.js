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
  production: dbConfig,
  // This prevents "undefined" error from popping up in the backend tests
  test: {
    url: process.env.DATABASE_URL_TEST || 'postgres://localhost:5432/literary_travels_test',
    dialect: 'postgres',
    logging: false
  }
};
