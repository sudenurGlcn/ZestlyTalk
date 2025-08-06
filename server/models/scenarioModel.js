// models/scenario.model.js
export default (sequelize, DataTypes) => {
  const Scenario = sequelize.define('Scenario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(150), allowNull: false },
    role_description: { type: DataTypes.TEXT, allowNull: true },
    category: { type: DataTypes.STRING(100), allowNull: true },
    difficulty_level: {
      type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2'),
      allowNull: true,
    },
    base_prompt: { type: DataTypes.TEXT, allowNull: true },
    is_premium: { type: DataTypes.BOOLEAN, defaultValue: false },
    milestones: { type: DataTypes.JSONB, allowNull: true },  // Yeni eklendi
    scenario_info: { type: DataTypes.TEXT, allowNull: true },   // yeni alan
    milestones_tr: { type: DataTypes.JSONB, allowNull: true },  // yeni alan
  }, {
    tableName: 'scenarios',
    timestamps: false,
    underscored: true,
  });

  Scenario.associate = (models) => {
    Scenario.hasMany(models.Chat, { foreignKey: 'scenario_id', as: 'chats' });
  };

  return Scenario;
};