// models/grammar-error.model.js
export default (sequelize, DataTypes) => {
  const GrammarError = sequelize.define('GrammarError', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chat_id: { type: DataTypes.INTEGER, allowNull: false },
    message_id: { type: DataTypes.INTEGER, allowNull: true },
    error_type: { type: DataTypes.STRING(100), allowNull: true },
    error_topic: { type: DataTypes.STRING(100), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    suggestion: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'grammar_errors',
    timestamps: false,
    underscored: true,
  });

  GrammarError.associate = (models) => {
    GrammarError.belongsTo(models.Chat, { foreignKey: 'chat_id', as: 'chat' });
    GrammarError.belongsTo(models.ChatMessage, { foreignKey: 'message_id', as: 'message' });
  };

  return GrammarError;
};
