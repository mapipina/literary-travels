import { Sequelize } from 'sequelize';
const config = require('./config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  // Use Pooled for app traffic, fallback to Direct if Pooled isn't set
  process.env.DATABASE_URL_POOLED || config.url, 
  config
);

export default sequelize;
