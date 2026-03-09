import { Sequelize } from 'sequelize';
const allConfigs = require('./config.js');
const env = process.env.NODE_ENV || 'development';
const config = allConfigs[env] || allConfigs['development'];

const sequelize = new Sequelize(
  // Priority: Pooled Env > Config URL > Local Fallback
  process.env.DATABASE_URL_POOLED || config.url || 'postgres://localhost:5432/literary_travels', 
  config
);

export default sequelize;
