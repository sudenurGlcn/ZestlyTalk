// models/vocabulary-stat.model.js
export default (sequelize, DataTypes) => {
  const VocabularyStat = sequelize.define('VocabularyStat', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    word: { type: DataTypes.STRING(100), allowNull: false },
    frequency: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    context_sentence: { type: DataTypes.TEXT, allowNull: true },
    suggestions: { type: DataTypes.JSONB, allowNull: true },
    last_used: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'vocabulary_stats',
    timestamps: false,
    underscored: true,
  });

  VocabularyStat.associate = (models) => {
    VocabularyStat.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return VocabularyStat;
};