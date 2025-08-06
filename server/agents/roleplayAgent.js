import AgentBase from './agentBase.js';
import GeminiService from '../services/geminiService.js';
import LangGraphPTHelper from '../helpers/langGraphPTHelper.js';
import db from '../models/index.js';

export default class RoleplayAgent extends AgentBase {
  constructor() {
    super('RoleplayAgent');
  }

  async handleRequest({ userId, chatId, userMessage, context }) {
    const { scenarioDescription, difficultyLevel, roleDescription, chatHistory } = context;

    const chat = await db.Chat.findByPk(chatId, {
      include: [{ model: db.Scenario, as: 'scenario', attributes: ['milestones'] }],
    });

    const scenarioMilestones = chat?.scenario?.milestones?.points || [];
    const progress = chat.progress || {};
    const completed = (progress.milestones || []).map(m => m.trim().toLowerCase());

    // Kalan milestone’ları filtrele
    const normalize = str => str.trim().toLowerCase();
    const remainingMilestones = scenarioMilestones
      .map(m => m.description)
      .filter(m => !completed.includes(normalize(m)));

    const prompt = LangGraphPTHelper.buildRoleplayPrompt({
      scenarioDescription,
      difficultyLevel,
      roleDescription,
      chatHistory,
      userMessage,
      scenarioMilestones: scenarioMilestones.map(m => m.description),
      completedMilestones: progress.milestones || [],
      remainingMilestones,
    });

    const response = await GeminiService.generateGeminiResponse([
      { parts: [{ text: prompt }] }
    ]);

    return response;
  }

}
