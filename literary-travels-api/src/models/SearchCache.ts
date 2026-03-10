import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { WikiDataDTO } from './WikiDataDTO';

interface SearchCacheAttributes {
  id: number;
  location: string;
  data: WikiDataDTO[];
  expiresAt: Date;
}

interface SearchCacheCreationAttributes extends Optional<SearchCacheAttributes, 'id'> {}

class SearchCache extends Model<SearchCacheAttributes, SearchCacheCreationAttributes> implements SearchCacheAttributes {
  public id!: number;
  public location!: string;
  public data!: any;
  public expiresAt!: Date;
}

SearchCache.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'search_caches',
  }
);

export default SearchCache;