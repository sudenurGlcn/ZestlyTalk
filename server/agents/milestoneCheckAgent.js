import AgentBase from './agentBase.js';
import GeminiService from '../services/geminiService.js';
import db from '../models/index.js';

export default class MilestoneCheckAgent extends AgentBase {
  constructor() {
    super('MilestoneCheckAgent');
  }

  async handleRequest({ chatId, userMessage }) {
    const chat = await db.Chat.findByPk(chatId, {
      include: [{ model: db.Scenario, as: 'scenario', attributes: ['milestones'] }],
    });

    const milestoneObj = chat?.scenario?.milestones || {};
    const scenarioMilestones = milestoneObj.points || [];
    if (scenarioMilestones.length === 0) return;

    // Son 15 mesajı al (önceden 4’tü)
    const messages = await db.ChatMessage.findAll({
      where: { chat_id: chatId },
      order: [['timestamp', 'ASC']],
      limit: 15,
    });

    const chatText = messages.map(m => `${m.sender === 'user' ? 'User' : 'AI'}: ${m.message}`).join('\n');

    const prompt = `
You are a milestone detection agent.

Your task is to analyze the user conversation below and determine which of the following **milestones (goals)** have been completed.

Milestones are user accomplishments during a roleplay conversation. Consider nuances, paraphrasing, and context. Even if the user doesn't use the exact words, if the intent is clearly fulfilled, the milestone is considered completed.

Here are the milestones:
${scenarioMilestones.map((m, i) => `${i + 1}. ${m.description}`).join('\n')}

Examples of matching:
- "Can I get the Wi-Fi password?" → matches "User requests the Wi-Fi password"
- "I want medium latte" → matches "User specifies drink size"
- "No, that’s all for now" → could indicate order confirmation

Conversation:
${chatText}

Return ONLY a valid JSON array of **milestone descriptions** (exactly as written above) that were clearly completed by the user based on the conversation.
`.trim();

    const rawResponse = await GeminiService.generateGeminiResponse([{ parts: [{ text: prompt }] }]);

    try {
      const jsonStart = rawResponse.indexOf('[');
      const jsonEnd = rawResponse.lastIndexOf(']');
      const jsonString = rawResponse.slice(jsonStart, jsonEnd + 1);
      const newlyCompletedMilestonesRaw = JSON.parse(jsonString);

      const normalize = str => str.trim().toLowerCase();
      const newlyCompletedMilestones = newlyCompletedMilestonesRaw.map(normalize).filter(Boolean);

      const currentProgress = chat.progress || {};
      const prevMilestonesRaw = currentProgress.milestones || [];
      const prevMilestones = prevMilestonesRaw.map(normalize);

      const filteredNewMilestones = newlyCompletedMilestones.filter(m => !prevMilestones.includes(m));
      if (filteredNewMilestones.length === 0) return;

      const uniqueMilestonesNormalized = [...new Set([...prevMilestones, ...filteredNewMilestones])];

      const normalizedToOriginalMap = new Map();
      scenarioMilestones.forEach(m => {
        normalizedToOriginalMap.set(normalize(m.description), m.description);
      });

      const uniqueMilestonesOriginal = uniqueMilestonesNormalized
        .map(n => normalizedToOriginalMap.get(n))
        .filter(Boolean);

      const percentComplete = Math.round((uniqueMilestonesOriginal.length / scenarioMilestones.length) * 100);

      await db.Chat.update({
        progress: {
          ...currentProgress,
          milestones: uniqueMilestonesOriginal,
          target_milestones: scenarioMilestones.length,
          percent_complete: percentComplete,
        }
      }, {
        where: { id: chatId }
      });

    } catch (err) {
      console.error('MilestoneCheckAgent JSON parse hatası:', err);
    }
  }
}
