// models/chat-message.model.js
export default (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define('ChatMessage', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chat_id: { type: DataTypes.INTEGER, allowNull: false },
    sender: {
      type: DataTypes.ENUM('user', 'agent'),
      allowNull: false,
    },
    message: { type: DataTypes.TEXT, allowNull: false },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    analysis: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  }, {
    tableName: 'chat_messages',
    timestamps: false,
    underscored: true,
  });

  ChatMessage.associate = (models) => {
    ChatMessage.belongsTo(models.Chat, { foreignKey: 'chat_id', as: 'chat' });
    ChatMessage.hasMany(models.GrammarError, { foreignKey: 'message_id', as: 'grammarErrors' });
  };

  return ChatMessage;
};