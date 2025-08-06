// src/agents/mentorAgent.js
import AgentBase from './agentBase.js';
import GeminiService from '../services/geminiService.js';
import db from '../models/index.js';

export default class MentorAgent extends AgentBase {
  constructor() {
    super('MentorAgent');
  }

  /**
   * Kullanıcının son 5 sohbetindeki tüm user mesajlarının gramer ve vocab hatalarını alır,
   * analiz eder ve Gemini'ye mentor içeriği sorar.
   * @param {Object} param0
   * @param {number} param0.userId
   */
  async handleRequest({ userId }) {
    // 1. Kullanıcının son 5 sohbetini al (id sıralı DESC)
    const lastChats = await db.Chat.findAll({
      where: { user_id: userId },
      order: [['started_at', 'DESC']],
      limit: 5,
      attributes: ['id'],
    });

    if (!lastChats.length) return null;

    // 2. Bu chatlerin id'lerini al
    const chatIds = lastChats.map(c => c.id);

    // 3. Bu chatlere ait tüm user mesajlarını al
    const userMessages = await db.ChatMessage.findAll({
      where: { chat_id: chatIds, sender: 'user' },
      attributes: ['id', 'chat_id', 'message'],
    });

    if (!userMessages.length) return null;

    // 4. Bu mesajların id'lerini al
    const messageIds = userMessages.map(m => m.id);

    // 5. Grammar hatalarını bu mesajlarda ara
    const grammarErrors = await db.GrammarError.findAll({
      where: { chat_id: chatIds, message_id: messageIds },
      attributes: ['error_topic'],
    });

    // 6. Vocabulary hatalarını userId'ye göre al (son 20 kullanım gibi)
    const vocabStats = await db.VocabularyStat.findAll({
      where: { user_id: userId },
      order: [['last_used', 'DESC']],
      limit: 20,
      attributes: ['word'],
    });

    // 7. En sık görülen grammar topic ve vocab word bul
    const grammarTopics = grammarErrors.map(e => e.error_topic).filter(Boolean);
    const mostCommonGrammarTopic = this.#findMostFrequent(grammarTopics);

    const vocabWords = vocabStats.map(v => v.word).filter(Boolean);
    const mostCommonVocab = this.#findMostFrequent(vocabWords);

    // Eğer hiçbir hata veya vocab yoksa default değerler ver
    const grammarTopicForPrompt = mostCommonGrammarTopic || "Basic verb tenses";
    const vocabWordForPrompt = mostCommonVocab || "common words";

    // 8. Gemini prompt hazırla
    const prompt = `
You are a Mentor Agent in a personalized English learning system.

The user repeatedly struggles with:
- Grammar topic: "${grammarTopicForPrompt}"
- Vocabulary word/area: "${vocabWordForPrompt}"

Generate the following in JSON format:
1. A short grammar explanation of "${grammarTopicForPrompt}" (max 5 lines, in **Turkish**, but keep all grammar terms like present perfect, conditionals etc. in **English**)
2. A vocabulary enhancement suggestion for "${vocabWordForPrompt}" (also in **Turkish**, but preserve the English vocabulary terms)
3. A 5-question mini test (multiple choice, JSON format, in English)

Respond only with a valid JSON like:
{
  "grammar_summary": "Present perfect tense, geçmişte başlamış ve etkisi hala süren olaylar için kullanılır. Örnek olarak, 'I have eaten' ifadesi geçmişte yeme eyleminin tamamlandığını ama etkisinin sürdüğünü gösterir.",
  "vocabulary_tip": "‘Make’ fiilinin çok yönlü kullanımı vardır. Özellikle ‘make a decision’, ‘make progress’ gibi kalıplar ezberlenmelidir.",
  "mini_test": [
    {
      "question": "Which sentence uses present perfect correctly?",
      "options": ["I eat already", "I have eaten already", "I have eat", "I am eat already"],
      "answer": "B"
    },
    ...
  ]
}
Conversation context is not needed.
`.trim();

    // 9. Gemini'den cevap al
    const rawResponse = await GeminiService.generateGeminiResponse([
      { parts: [{ text: prompt }] },
    ]);

    try {
      const jsonStart = rawResponse.indexOf('{');
      const jsonEnd = rawResponse.lastIndexOf('}');
      const jsonString = rawResponse.slice(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    } catch (err) {
      console.error('MentorAgent JSON parse hatası:', err);
      return null;
    }
  }

  #findMostFrequent(arr) {
    const freq = {};
    arr.forEach(item => {
      freq[item] = (freq[item] || 0) + 1;
    });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || '';
  }
}
