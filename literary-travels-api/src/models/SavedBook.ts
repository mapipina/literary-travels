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
  declare wikidataId: string;
  declare isbn: string | null;
  declare coverUrl: string | null;
  declare description: string | null;
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
  wikidataId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true
  },
  coverUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'SavedBook',
  tableName: 'saved_books',
});

export default SavedBook;
