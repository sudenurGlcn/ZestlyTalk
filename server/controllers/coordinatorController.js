// src/controllers/coordinatorController.js

import CoordinatorAgent from '../agents/coordinatorAgent.js';
import db from '../models/index.js';
import ChatMessageService from '../services/chatMessageService.js';
import grammarErrorService from '../services/grammarErrorService.js';
import vocabularyStatService from '../services/vocabularyStatService.js';

const coordinatorAgent = new CoordinatorAgent();

class CoordinatorController {
  async handleUserMessage(req, res, next) {
    try {
      const { userId, chatId, userMessage, context = {} } = req.body;

      const chat = await db.Chat.findByPk(chatId, {
        include: {
          model: db.Scenario,
          as: 'scenario',
          attributes: ['difficulty_level', 'base_prompt', 'role_description'],
        },
      });

      if (!chat) return res.status(404).json({ error: 'Chat not found' });

      const scenario = chat.scenario;

      const userMessageRecord = await ChatMessageService.createMessage({
        chat_id: chatId,
        sender: 'user',
        message: userMessage,
      });

      const messages = await db.ChatMessage.findAll({
        where: { chat_id: chatId },
        order: [['timestamp', 'ASC']],
        limit: 4,
      });

      const chatHistory = messages.map(m => ({
        sender: m.sender,
        message: m.message,
      }));

      const enrichedContext = {
        ...context,
        difficultyLevel: scenario?.difficulty_level || 'A1',
        scenarioDescription: scenario?.base_prompt || '',
        roleDescription: scenario?.role_description || '',
        chatHistory,
        userMessage,
      };

      const result = await coordinatorAgent.handleRequest({
        userId,
        chatId,
        userMessage,
        context: enrichedContext,
      });

      const agentMessageRecord = await ChatMessageService.createMessage({
        chat_id: chatId,
        sender: 'agent',
        message: result.response,
        analysis: result.analysis || null,
      });

      // 💾 Grammar hatalarını veritabanına kaydet
      if (Array.isArray(result.analysis?.grammar) && result.analysis.grammar.length > 0) {
        const errorsToSave = result.analysis.grammar.map(error => ({
          chat_id: chatId,
          message_id: userMessageRecord.id,
          error_type: error.topic || null,
          error_topic: error.topic || null,
          description: error.explanation || null,
          suggestion: error.suggestion || null,
        }));

        await grammarErrorService.createErrorsBulk(errorsToSave);
      }

      if (Array.isArray(result.analysis?.vocabulary) && result.analysis.vocabulary.length > 0) {
  const vocabToSave = result.analysis.vocabulary.map(vocab => ({
    word: vocab.original_word,
    context_sentence: vocab.context,
    suggestions: vocab.suggestions,
  }));

  await vocabularyStatService.createOrUpdateStatsBulk(userId, vocabToSave);
}

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
async handleEndOfConversation(req, res, next) {
    try {
      const { userId, chatId } = req.body;
      if (!userId || !chatId) {
        return res.status(400).json({ error: 'userId ve chatId zorunludur' });
      }

      const result = await coordinatorAgent.handleConversationEnd({ userId, chatId });
      res.json(result);
    } catch (err) {
      console.error('handleEndOfConversation:', err);
      res.status(500).json({ error: 'Sohbet özeti oluşturulamadı' });
    }
  }

  async getHints(req, res, next) {
  try {
    const { chatId } = req.body;

    if (!chatId) {
      return res.status(400).json({ error: 'chatId gereklidir' });
    }

    const result = await coordinatorAgent.handleHintRequest({ chatId });
    res.json(result);
  } catch (err) {
    console.error('getHints:', err);
    res.status(500).json({ error: 'Hint üretilemedi' });
  }
}

// Yeni mentor-tips endpoint
  async getMentorTips(req, res, next) {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId zorunludur' });

      const result = await coordinatorAgent.handleMentorshipRequest({ userId });
      res.json(result);
    } catch (err) {
      console.error('getMentorTips:', err);
      res.status(500).json({ error: 'Mentor önerisi üretilemedi' });
    }
  }

  async handleFreeChat(req, res, next) {
  try {
    const { userId, chatId, userMessage } = req.body;

    if (!userId || !chatId || !userMessage) {
      return res.status(400).json({ error: 'userId, chatId ve userMessage zorunludur' });
    }

    const messages = await db.ChatMessage.findAll({
      where: { chat_id: chatId },
      order: [['timestamp', 'ASC']],
      limit: 4,
    });

    const chatHistory = messages.map(m => ({
      sender: m.sender,
      message: m.message,
    }));

    // Agent'a parametre objesi olarak gönder
    const result = await coordinatorAgent.handleFreeTalk({
      userId,
      chatId,
      userMessage,
      chatHistory,
    });

    res.json(result);
  } catch (err) {
    console.error('❌ handleFreeChat:', err);
    res.status(500).json({ error: 'Serbest sohbet sırasında hata oluştu' });
  }
}

  
}

export default new CoordinatorController();
