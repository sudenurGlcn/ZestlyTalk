// src/agents/fluencyAgent.js

import AgentBase from './agentBase.js';
import GeminiService from '../services/geminiService.js';

export default class FluencyAgent extends AgentBase {
  constructor() {
    super('FluencyAgent');
  }

  /**
   * Kullanıcının cümlelerini daha doğal ve akıcı hale getirir.
   * @param {Object} param0
   * @param {string} param0.text
   * @returns {Promise<Array>} - { original, suggestion, explanation }
   */
  async handleRequest({ text }) {
    if (!text || typeof text !== 'string') {
      console.warn('FluencyAgent: Geçersiz metin girdisi');
      return [];
    }

    const prompt = `
You are a fluency improvement agent in an English learning system.

Your task is to improve the **fluency** of the following English sentences. Keep the original meaning, but rewrite the sentence so it sounds more **natural**, like a native speaker would say.

For each suggestion, return a JSON object with:
- "original": the original sentence
- "suggestion": the improved version
- "explanation": why this suggestion is more natural (in 1-2 lines)

Respond ONLY with a valid JSON array.

Text:
"${text}"

Format:
[
  {
    "original": "I very like this movie.",
    "suggestion": "I really like this movie.",
    "explanation": "Native speakers use 'really' instead of 'very' with 'like'."
  }
]
`.trim();

    const rawResponse = await GeminiService.generateGeminiResponse([
      { parts: [{ text: prompt }] }
    ]);

    try {
      const jsonStart = rawResponse.indexOf('[');
      const jsonEnd = rawResponse.lastIndexOf(']');
      const jsonString = rawResponse.slice(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    } catch (err) {
      console.error('FluencyAgent: JSON parse hatası:', err);
      return [];
    }
  }
}

