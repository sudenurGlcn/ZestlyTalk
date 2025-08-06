// src/agents/vocabularyAnalysisAgent.js

import AgentBase from './agentBase.js';
import GeminiService from '../services/geminiService.js';
import VocabularyAnalysisParser from '../parsers/vocabularyAnalysisParser.js';

export default class VocabularyAnalysisAgent extends AgentBase {
  constructor() {
    super('VocabularyAnalysisAgent');
  }

  /**
   * Kullanıcının kelime kullanımını analiz eder.
   * @param {Object} param0
   * @param {string} param0.text - Kullanıcının mesajı
   * @param {number} param0.chatId - Chat ID (geçmişe erişmek için)
   * @param {Object} param0.context - Zorluk seviyesi gibi bilgiler
   * @returns {Promise<Array>} - Kelime analiz sonuçları
   */
  async handleRequest({ text, chatId, context }) {
    if (!text || typeof text !== 'string') {
      console.warn('VocabularyAnalysisAgent: Geçersiz metin girdisi');
      return [];
    }

    const difficultyLevel = context?.difficultyLevel || 'unknown';


       const prompt = `
You are a vocabulary analysis agent in a personalized English learning system.

The scenario's difficulty level is: "${difficultyLevel}".

Your task is to analyze the user's most recent message and suggest vocabulary improvements that are appropriate for the given difficulty level.

🧠 Important Instructions:
- Always analyze the **full sentence and phrase context** — not just isolated words.
- If the user has used an unnatural or incorrect phrase (e.g., "make return"), suggest a more natural **expression or verb phrase**, not just word-level synonyms.
- Focus on improving natural fluency, grammar, and clarity while keeping the user's intended meaning intact.
- Avoid robotic or overly formal suggestions unless appropriate for the level.
- If the sentence contains misspellings or grammar errors, try to **infer the intended structure** and provide a better expression.
- Do not suggest vague words like "better", "more important", "nice" unless they clearly enhance the sentence in context.
- Only suggest meaningful improvements that:
  - Improve fluency or clarity
  - Use natural phrasing for the level
  - Encourage vocabulary growth without losing intended meaning

🧾 Output Format:
Return only a **valid JSON array** of objects with the following fields:
- "original_word": The word or phrase used by the user
- "suggestions": List of better or more natural alternatives
- "context": Short sentence showing how the word/phrase was used

Text:
"${text}"

Format:
[
  {
    "original_word": "make return",
    "suggestions": ["return an item", "make a return", "initiate a return"],
    "context": "I want to make return"
  }
]
`.trim();


    const rawResponse = await GeminiService.generateGeminiResponse([
      { parts: [{ text: prompt }] },
    ]);

    return VocabularyAnalysisParser.parseResponse(rawResponse);
  }


}
