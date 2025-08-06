// src/repositories/ChatRepository.js
import db from '../models/index.js';  // default import
import { Sequelize } from 'sequelize';

const { Chat } = db; // User modelini db nesnesinden al

class ChatRepository {
  async createChat(data) {
    return await Chat.create(data);
  }

  async getChatById(id) {
    return await Chat.findByPk(id);
  }

  async getChatsByUserId(user_id) {
    return await Chat.findAll({ where: { user_id } });
  }

  async getChatsByScenarioId(scenario_id) {
    return await Chat.findAll({ where: { scenario_id } });
  }

  async updateChat(id, updatedData) {
    await Chat.update(updatedData, { where: { id } });
    return this.getChatById(id);
  }

  async deleteChat(id) {
    return await Chat.destroy({ where: { id } });
  }

  async getActiveChatsByUserId(user_id) {
  return await Chat.findAll({
    where: {
      user_id,
      status: 'active',
    },
    include: [
      {
        model: db.Scenario,
        as: 'scenario',
        attributes: ['title', 'difficulty_level', 'scenario_info', 'milestones_tr'],
      },
    ],
    order: [['started_at', 'DESC']],
  });
}

async getChatsByUserIdAndStatuses(user_id, statuses = ['active', 'completed']) {
  return await Chat.findAll({
    where: {
      user_id,
      status: statuses,
    },
    include: [
      {
        model: db.Scenario,
        as: 'scenario',
        attributes: ['title', 'difficulty_level', 'scenario_info', 'milestones_tr'],
      },
    ],
    attributes: {
      include: [
        // Son mesaj
        [
          Sequelize.literal(`(
            SELECT message
            FROM chat_messages
            WHERE chat_messages.chat_id = "Chat"."id"
            ORDER BY timestamp DESC
            LIMIT 1
          )`),
          'lastMessage',
        ],
        // Mesaj sayısı
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM chat_messages
            WHERE chat_messages.chat_id = "Chat"."id"
          )`),
          'messageCount',
        ],
      ],
    },
    order: [['started_at', 'DESC']],
  });
}

async getChatWithScenarioById(id) {
  return await Chat.findByPk(id, {
    include: [
      {
        model: db.Scenario,
        as: 'scenario',
        attributes: ['title', 'difficulty_level', 'scenario_info', 'milestones_tr'],
      },
    ],
  });
}
async getMostRecentlyMessagedActiveChat(user_id, scenario_id) {
  console.log('🔍 getMostRecentlyMessagedActiveChat çağrıldı:', { user_id, scenario_id });
  
  const result = await db.Chat.findOne({
    where: {
      user_id,
      scenario_id,
      status: 'active',
    },
    include: [
      {
        model: db.ChatMessage,
        as: 'messages',
        attributes: [],
      },
      {
        model: db.Scenario,
        as: 'scenario',
        attributes: ['title', 'difficulty_level', 'scenario_info', 'milestones_tr'],
      },
    ],
    order: [[Sequelize.literal(`(
      SELECT MAX(timestamp)
      FROM chat_messages
      WHERE chat_messages.chat_id = "Chat"."id"
    )`), 'DESC']],
  });

  console.log('🔍 getMostRecentlyMessagedActiveChat sonucu:', 
    result ? { 
      chatId: result.id, 
      status: result.status, 
      messageCount: result.messages?.length || 0 
    } : 'Chat bulunamadı'
  );

  return result;
}
}

export default new ChatRepository();
