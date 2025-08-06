import AgentBase from './agentBase.js';
import GeminiService from '../services/geminiService.js';
import db from '../models/index.js';

export default class ConversationSummaryAgent extends AgentBase {
  constructor() {
    super('ConversationSummaryAgent');
  }

  async handleRequest({ userId, chatId }) {
    // 1. Konuşma geçmişini veritabanından çek
    const messages = await db.ChatMessage.findAll({
      where: { chat_id: chatId },
      order: [['timestamp', 'ASC']],
    });

    const chatText = messages
      .map(m => `${m.sender === 'user' ? 'User' : 'AI'}: ${m.message}`)
      .join('\n');

    if (!chatText) return { summary: '', recommendations: [] };

    // 2. Gemini prompt
    const prompt = `
You are an English learning mentor agent.

Analyze the entire conversation below and return:
- A short **summary** of how the user performed in grammar, vocabulary, and fluency.
- A list of **3 specific learning recommendations** based on common patterns or mistakes.

⚠️ Respond with a valid JSON in the **exact format shown below**.
📌 All content inside the JSON (summary and recommendations) **must be in Turkish**.

Example format:
{
  "summary": "Kullanıcının kelime dağarcığı güçlü, ancak zaman kipleri kullanımında zorlanıyor.",
  "recommendations": [
    "Present perfect ve past simple zamanlarının farklarını gözden geçir.",
    "Aynı yapıdaki cümleleri tekrar etmekten kaçınarak daha çeşitli cümleler kur.",
    "Günlük aktiviteler hakkında daha doğal ifadeler kullanmayı dene."
  ]
}

Conversation:
${chatText}
    `.trim();

    const rawResponse = await GeminiService.generateGeminiResponse([
      { parts: [{ text: prompt }] },
    ]);

    try {
      const jsonStart = rawResponse.indexOf('{');
      const jsonEnd = rawResponse.lastIndexOf('}');
      const jsonString = rawResponse.slice(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    } catch (err) {
      console.error('ConversationSummaryAgent JSON parse hatası:', err);
      return { summary: '', recommendations: [] };
    }
  }
}
