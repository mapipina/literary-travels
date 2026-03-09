import 'dotenv/config';
import app from './app';
import sequelize from './config/database';

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.info('Db is synced'); 
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(`Error occurred syncing db: ${err}`));

