import bcrypt from 'bcrypt';
import config from '../config/env.js'; // uzantı önemli, ES Module'de genelde uzantı yazılır

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    first_name: { type: DataTypes.STRING(100), allowNull: false },
    last_name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },

    password_hash: { type: DataTypes.TEXT, allowNull: false },

    password: {
      type: DataTypes.VIRTUAL,
      set(value) {
        this.setDataValue('password', value);
        const salt = bcrypt.genSaltSync(config.bcrypt.saltRounds);
        const hash = bcrypt.hashSync(value, salt);
        this.setDataValue('password_hash', hash);
      },
      validate: {
        len: {
          args: [6, 100],
          msg: 'Password must be between 6 and 100 characters',
        },
      },
    },

    level: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        isIn: [['A1', 'A2', 'B1', 'B2', 'C1', 'C2']],
      },
      defaultValue: null,
    },

    native_language: { type: DataTypes.STRING(50), allowNull: true },

    last_login: { type: DataTypes.DATE, allowNull: true },

  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    defaultScope: {
      attributes: { exclude: ['password_hash'] }
    },
    scopes: {
      withPassword: {
        attributes: {},
      }
    }
  });

  User.prototype.validatePassword = function(password) {
    return bcrypt.compare(password, this.password_hash);
  };

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    delete values.password_hash;
    delete values.createdAt;
    delete values.updatedAt;
    delete values.native_language;
    delete values.last_login;
    return values;
  };

  User.associate = function(models) {
    User.hasMany(models.Chat, { foreignKey: 'user_id', as: 'chats', onDelete: 'CASCADE' });
    User.hasMany(models.VocabularyStat, { foreignKey: 'user_id', as: 'vocabularyStats', onDelete: 'CASCADE' });
    User.hasMany(models.LevelTest, { foreignKey: 'user_id', as: 'levelTests', onDelete: 'CASCADE' });
    User.hasMany(models.PerformanceStat, { foreignKey: 'user_id', as: 'performanceStats', onDelete: 'CASCADE' });
  };

  return User;
};
