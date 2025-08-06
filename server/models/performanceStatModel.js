// models/performance-stat.model.js
export default (sequelize, DataTypes) => {
  const PerformanceStat = sequelize.define('PerformanceStat', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    period_start: { type: DataTypes.DATEONLY, allowNull: false },
    period_end: { type: DataTypes.DATEONLY, allowNull: false },
    grammar_error_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    vocabulary_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    chat_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  }, {
    tableName: 'performance_stats',
    timestamps: false,
    underscored: true,
  });

  PerformanceStat.associate = (models) => {
    PerformanceStat.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return PerformanceStat;
};