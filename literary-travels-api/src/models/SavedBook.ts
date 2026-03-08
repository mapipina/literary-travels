import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../config/database';

class SavedBook extends Model<InferAttributes<SavedBook>, InferCreationAttributes<SavedBook>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare author: string;
  declare location: string;
  declare lat: number;
  declare lng: number;
  declare genres: string[];
  declare publicationYear: number | null;
}

SavedBook.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  genres: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  publicationYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'SavedBook',
  tableName: 'saved_books',
});

export default SavedBook;
