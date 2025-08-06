// src/services/freeTalkChatService.js
import freeTalkChatRepository from '../repositories/freeTalkChatRepository.js';
import FreeTalkAgent from '../agents/freeTalkAgent.js';
import ChatMessageService from './chatMessageService.js';

class FreeTalkChatService {
  /**
   * Serbest sohbet chat'i oluştur ve Gemini'den ilk mesajı al
   * @param {Object} param0
   * @param {number} param0.user_id
   * @returns {Promise<Object>} { chatId, firstMessage, initialMessageId }
   */
  async createFreeTalkChat({ user_id }) {
    // 1. Chat oluştur
    const chat = await freeTalkChatRepository.createFreeTalkChat({ user_id });

    // 2. İlk mesaj için boş sohbet geçmişi
    const chatHistory = [];

    // 3. Gemini ile ilk mesajı al (kullanıcı mesajı boş string)
    const freeTalkAgent = new FreeTalkAgent();

    const firstMessage = await freeTalkAgent.handleRequest({
      userId: user_id,
      chatId: chat.id,
      userMessage: '',
      chatHistory,
    });

    // 4. İlk mesajı DB'ye kaydet (agent mesajı)
    const initialMessage = await ChatMessageService.createMessage({
      chat_id: chat.id,
      sender: 'agent',
      message: firstMessage,
    });

    return {
      chatId: chat.id,
      firstMessage,
      initialMessageId: initialMessage.id,
    };
  }

  async getChatById(chatId) {
    return await freeTalkChatRepository.getChatById(chatId);
  }
}

export default new FreeTalkChatService();
