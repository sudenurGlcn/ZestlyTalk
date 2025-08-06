// src/services/chatService.js
import chatRepository from '../repositories/chatRepository.js';
import db from '../models/index.js';
import RoleplayAgent from '../agents/roleplayAgent.js';
import ChatMessageService from './chatMessageService.js';
import LangGraphPTHelper from '../helpers/langGraphPTHelper.js';
import { Op } from 'sequelize'; // en üste ekle

class ChatService {
async createChat(data) {
  const { user_id, scenario_id } = data;

  // 1. Chat oluştur
  const chat = await chatRepository.createChat(data);

  // 2. Senaryo bilgilerini al
  const scenario = await db.Scenario.findByPk(scenario_id);
  if (!scenario) throw new Error('Senaryo bulunamadı.');

  // 3. Context oluştur
  const context = {
    scenarioDescription: scenario.base_prompt || '',
    difficultyLevel: scenario.difficulty_level || 'A1',
    roleDescription: scenario.role_description || '',
    chatHistory: [],
    userMessage: '',
  };

  // 4. İlk yanıtı al
  const agentResponse = await new RoleplayAgent().handleRequest({
    userId: user_id,
    chatId: chat.id,
    userMessage: '',
    context,
  });

  // 5. Mesajı kaydet
  const initialChatMessage = await ChatMessageService.createMessage({
    chat_id: chat.id,
    sender: 'agent',
    message: agentResponse,
  });

  // 🔥 6. Chat’i senaryo ile birlikte yeniden al
  const chatWithScenario = await chatRepository.getChatWithScenarioById(chat.id);

  // 7. Dönüş
  return {
    chatId: chat.id,
    response: agentResponse,
    chat: chatWithScenario,
    initialMessageId: initialChatMessage.id,
  };
}

  async getChatById(id) {
    return await chatRepository.getChatById(id);
  }

  async getChatsByUserId(user_id) {
    return await chatRepository.getChatsByUserId(user_id);
  }

  async getChatsByScenarioId(scenario_id) {
    return await chatRepository.getChatsByScenarioId(scenario_id);
  }

  async updateChat(id, updateData) {
    return await chatRepository.updateChat(id, updateData);
  }

  async deleteChat(id) {
    return await chatRepository.deleteChat(id);
  }

  async getActiveChatsByUserId(userId) {
  return await chatRepository.getActiveChatsByUserId(userId);
}

async getOrCreateActiveChat(userId, scenarioId) {
  console.log('🔍 getOrCreateActiveChat çağrıldı:', { userId, scenarioId });
  
  const existingChat = await chatRepository.getMostRecentlyMessagedActiveChat(userId, scenarioId);
  console.log('🔍 Mevcut chat kontrolü:', existingChat ? { chatId: existingChat.id, status: existingChat.status } : 'Chat bulunamadı');

  if (existingChat) {
    console.log('✅ Mevcut chat bulundu, mesajlar yükleniyor');
    const messages = await db.ChatMessage.findAll({
      where: { chat_id: existingChat.id },
      order: [['timestamp', 'ASC']],
    });
    
    console.log('📨 Yüklenen mesaj sayısı:', messages.length);
    
    const result = {
      chat: existingChat,
      isNew: false,
      messages: messages.map(m => ({
        id: m.id,
        sender: m.sender,
        message: m.message,
        timestamp: m.timestamp,
      })),
    };
    
    console.log('📤 Mevcut chat response\'u:', {
      chatId: result.chat.id,
      isNew: result.isNew,
      messageCount: result.messages.length
    });
    
    return result;
  }

  console.log('🆕 Mevcut chat bulunamadı, yeni chat oluşturuluyor');
  const createdChat = await this.createChat({ user_id: userId, scenario_id: scenarioId });

  const result = {
    chat: createdChat.chat,
    isNew: true,
    messages: [
      {
        id: createdChat.initialMessageId,
        sender: 'agent',
        message: createdChat.response,
      },
    ],
  };
  
  console.log('📤 Yeni chat response\'u:', {
    chatId: result.chat.id,
    isNew: result.isNew,
    messageCount: result.messages.length
  });
  
  return result;
}

async getChatsByUserIdAndStatuses(userId, statuses = ['active', 'completed']) {
    return await chatRepository.getChatsByUserIdAndStatuses(userId, statuses);
  }

  async forceCreateNewChat(userId, scenarioId) {
  const createdChat = await this.createChat({ user_id: userId, scenario_id: scenarioId });

  return {
    chat: createdChat.chat,
    isNew: true,
    messages: [
      {
        id: createdChat.initialMessageId,
        sender: 'agent',
        message: createdChat.response,
      },
    ],
  };
}

async calculateLanguageRadarScores(userId, period = 'all') {
  let whereCondition = {
    user_id: userId,
    status: ['active', 'completed'],
  };

  if (['week', 'month'].includes(period)) {
    const now = new Date();
    let startDate;

    if (period === 'week') {
      const day = now.getDay(); // 0 = Pazar
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else {
      // month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const endDate = new Date();

    whereCondition.started_at = {
      [Op.between]: [startDate, endDate],
    };
  }

  const chats = await db.Chat.findAll({
    where: whereCondition,
    order: [['started_at', 'DESC']],
  });

  if (!chats.length) {
    return {
      grammar: 0,
      vocabulary: 0,
      task_completion: 0,
    };
  }

  let grammarErrors = 0;
  let vocabularySum = 0;
  let percentCompleteSum = 0;
  let countWithVocab = 0;
  let countWithPercent = 0;

  chats.forEach(chat => {
    const progress = chat.progress || {};

    if (progress.grammar_error_count != null) {
      grammarErrors += progress.grammar_error_count;
    }

    if (progress.vocabulary_score != null) {
      vocabularySum += progress.vocabulary_score;
      countWithVocab++;
    }

    if (progress.percent_complete != null) {
      percentCompleteSum += progress.percent_complete;
      countWithPercent++;
    }
  });

  const avgGrammarErrors = grammarErrors / chats.length;
  const avgVocab = vocabularySum / (countWithVocab || 1);
  const avgPercentComplete = percentCompleteSum / (countWithPercent || 1);

  return {
    grammar: avgGrammarErrors,
    vocabulary: Math.min(100, avgVocab * 20),
    task_completion: avgPercentComplete,
  };
}
}

export default new ChatService();
