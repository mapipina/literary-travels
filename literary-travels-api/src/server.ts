import 'dotenv/config';
import app from './app';
import sequelize from './config/database';

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.info('Connection has been established successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(`Unable to connect to the database: ${err}`));
