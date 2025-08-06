// models/chat.model.js
export default (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    scenario_id: { type: DataTypes.INTEGER, allowNull: true },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'analyzed'),
      defaultValue: 'active',
      allowNull: false,
    },
    started_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    completed_at: { type: DataTypes.DATE, allowNull: true },
    score: { type: DataTypes.INTEGER, allowNull: true },
    feedback: { type: DataTypes.TEXT, allowNull: true },
    system_prompt: { type: DataTypes.TEXT, allowNull: true },
    progress: {
      type: DataTypes.JSONB,
      defaultValue: {},
      allowNull: false,
    },
  }, {
    tableName: 'chats',
    timestamps: false,
    underscored: true,
  });

  Chat.associate = (models) => {
    Chat.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Chat.belongsTo(models.Scenario, { foreignKey: 'scenario_id', as: 'scenario' });
    Chat.hasMany(models.ChatMessage, { foreignKey: 'chat_id', as: 'messages', onDelete: 'CASCADE' });
    Chat.hasMany(models.GrammarError, { foreignKey: 'chat_id', as: 'grammarErrors', onDelete: 'CASCADE' });
  };

  return Chat;
};