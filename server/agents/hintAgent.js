// src/agents/hintAgent.js
import AgentBase from './agentBase.js';
import GeminiService from '../services/geminiService.js';
import db from '../models/index.js';

export default class HintAgent extends AgentBase {
  constructor() {
    super('HintAgent');
  }

  /**
   * Kullanıcı, Gemini'nin son cevabına karşılık ne yazacağını bilemediğinde çağrılır.
   * Bu nedenle en son 4 mesaj alınır, en sondaki Gemini'nin cevabıdır.
   * @param {Object} param0
   * @param {number} param0.chatId
   * @returns {Promise<Object>} - { hints: ["..."] }
   */
  async handleRequest({ chatId }) {
    const messages = await db.ChatMessage.findAll({
      where: { chat_id: chatId },
      order: [['timestamp', 'DESC']],
      limit: 4,
    });

    if (!messages || messages.length === 0) {
      console.warn('HintAgent: Mesaj geçmişi bulunamadı');
      return { hints: [] };
    }

    // Zaman sırasına göre sırala (eski → yeni)
    const sortedMessages = messages.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    const chatHistory = sortedMessages
      .map(m => `${m.sender === 'user' ? 'User' : 'AI'}: ${m.message}`)
      .join('\n');

    const prompt = `
You are a helpful Hint Agent in an English learning app.

Based on the last 4 messages in this conversation (most recent is from AI), suggest 2-3 short, relevant things the user could say next. These hints should be:
- Natural follow-ups
- Easy to respond with
- Relevant to the conversation so far

Respond ONLY with a valid JSON array of objects like:
[
  { "english": "Ask a follow-up question", "turkish": "İlgili bir soru sor" },
  { "english": "Tell a short personal story", "turkish": "Kısa bir kişisel hikaye anlat" }
]

IMPORTANT: The prompt is in English but your output should include Turkish translations.

Conversation so far:
${chatHistory}
    `.trim();

    const rawResponse = await GeminiService.generateGeminiResponse([
      { parts: [{ text: prompt }] },
    ]);

    try {
      const jsonStart = rawResponse.indexOf('[');
      const jsonEnd = rawResponse.lastIndexOf(']');
      const jsonString = rawResponse.slice(jsonStart, jsonEnd + 1);
      const parsedHints = JSON.parse(jsonString);
      return { hints: Array.isArray(parsedHints) ? parsedHints : [] };
    } catch (err) {
      console.error('HintAgent JSON parse hatası:', err);
      return { hints: [] };
    }
  }
}
