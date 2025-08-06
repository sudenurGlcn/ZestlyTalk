// src/agents/freeTalkAgent.js
import AgentBase from './agentBase.js';
import GeminiService from '../services/geminiService.js';
import db from '../models/index.js';

export default class FreeTalkAgent extends AgentBase {
  constructor() {
    super('FreeTalkAgent');
  }

  /**
   * Serbest sohbet için dil modeli yanıtı üretir
   * @param {Object} param0
   * @param {number} param0.userId
   * @param {number} param0.chatId
   * @param {string} param0.userMessage
   * @param {Array<{sender:string,message:string}>} param0.chatHistory
   * @returns {Promise<string>}
   */
  async handleRequest({ userId, chatId, userMessage, chatHistory }) {
    const lastTurns = chatHistory.slice(-4).map(m => `${m.sender}: ${m.message}`).join('\n');

    const prompt = `
# SYSTEM INSTRUCTION
You are a friendly English-speaking chatbot designed to help learners practice English freely.
Avoid judgment or corrections. Encourage natural conversation, ask interesting follow-up questions.

# RULES
1. English Only
2. Friendly and open tone
3. Ask curious, open-ended questions
4. Avoid repeating yourself
5. Never give negative feedback

# CHAT HISTORY (last 4 turns)
${lastTurns}

# USER'S LATEST MESSAGE
User: "${userMessage}"

# YOUR RESPONSE
`.trim();

    const response = await GeminiService.generateGeminiResponse([
      { parts: [{ text: prompt }] }
    ]);

    return response;
  }
}
