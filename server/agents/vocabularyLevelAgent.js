import AgentBase from './agentBase.js';
import GeminiService from '../services/geminiService.js';
import db from '../models/index.js';

export default class VocabularyLevelAgent extends AgentBase {
  constructor() {
    super('VocabularyLevelAgent');
  }

  /**
   * Chat içindeki tüm kullanıcı mesajlarını analiz edip ortalama vocabulary seviyesi puanı hesaplar.
   * @param {Object} param0
   * @param {number} param0.chatId
   * @returns {Promise<{averageLevel: number, detail: object}>} Ortalama kelime seviyesi ve detaylı analiz
   */
  async handleRequest({ chatId }) {
    // 1. Chat mesajlarını al (sadece user mesajları)
    const messages = await db.ChatMessage.findAll({
      where: { chat_id: chatId, sender: 'user' },
      order: [['timestamp', 'ASC']],
    });

    if (!messages.length) return { averageLevel: 0, detail: {} };

    // 2. Tüm mesajları birleştir (örneğin promptta kullanmak için)
    const allText = messages.map(m => m.message).join('\n');

    // 3. Gemini prompt oluştur
    const prompt = `
You are a vocabulary level assessment agent for English learners.
Analyze the vocabulary used by the user in the text below.
Assign a CEFR level to each unique word or phrase (A1=1, A2=2, B1=3, B2=4, C1=5).
Calculate the average vocabulary level score for the whole text.
Return JSON with:
{
  "average_level": number (1 to 5),
  "words": [
    {
      "word": string,
      "level": number,
      "count": number
    }
  ]
}

Text:
${allText}
    `.trim();

    const rawResponse = await GeminiService.generateGeminiResponse([
      { parts: [{ text: prompt }] },
    ]);

    try {
      const jsonStart = rawResponse.indexOf('{');
      const jsonEnd = rawResponse.lastIndexOf('}');
      const jsonString = rawResponse.slice(jsonStart, jsonEnd + 1);
      const result = JSON.parse(jsonString);

      return {
        averageLevel: result.average_level || 0,
        detail: result,
      };
    } catch (err) {
      console.error('VocabularyLevelAgent JSON parse hatası:', err);
      return { averageLevel: 0, detail: {} };
    }
  }
}
