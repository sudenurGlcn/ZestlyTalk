// models/level-test.model.js
export default (sequelize, DataTypes) => {
  const LevelTest = sequelize.define('LevelTest', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    test_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    result_level: { type: DataTypes.STRING(20), allowNull: true },
    score: { type: DataTypes.INTEGER, allowNull: true },
    details: { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: 'level_tests',
    timestamps: false,
    underscored: true,
  });

  LevelTest.associate = (models) => {
    LevelTest.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return LevelTest;
};