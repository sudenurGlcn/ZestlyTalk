import CEFR_RULES from '../data/cefrRules.js';

class LangGraphPTHelper {
  /**
   * Roleplay prompt'u oluşturur.
   * @param {Object} param0 
   * @param {string} param0.scenarioDescription
   * @param {string} param0.difficultyLevel
   * @param {string} param0.roleDescription
   * @param {Array<{sender:string,message:string}>} param0.chatHistory
   * @param {string} param0.userMessage
   * @returns {string}
   */
  buildRoleplayPrompt({
  scenarioDescription,
  difficultyLevel,
  roleDescription,
  chatHistory,
  userMessage,
  scenarioMilestones = [],
  completedMilestones = [],
  remainingMilestones = [],
}) {
  const cefr = CEFR_RULES[difficultyLevel];
  const rules = cefr
    ? `# CEFR LEVEL RULES (${difficultyLevel})
- Grammar: ${cefr.grammar.join(', ')}
- Vocabulary: ${cefr.vocabulary}`
    : `# CEFR RULES: Not found for level ${difficultyLevel}`;

  const conversationHistory = chatHistory
    .map(m => `${m.sender}: ${m.message}`)
    .join('\n');

  const milestoneBlock = `
# SCENARIO MILESTONES
- Total Milestones:
${scenarioMilestones.map((m, i) => `  ${i + 1}. ${m}`).join('\n')}

- Already Completed:
${completedMilestones.length > 0 ? completedMilestones.map((m, i) => `  ${i + 1}. ${m}`).join('\n') : '  (None yet)'}

- Focus Only On:
${remainingMilestones.length > 0 ? remainingMilestones.map((m, i) => `  ${i + 1}. ${m}`).join('\n') : '  (All done!)'}

**IMPORTANT**: Do NOT repeat any completed milestone. Focus ONLY on remaining ones.
`.trim();

  const prompt = `
# SYSTEM INSTRUCTION
You are a Roleplay Agent in an English learning app. Your mission is to embody a character and engage in a realistic conversation, strictly adhering to the specified scenario's difficulty level (CEFR).

# CORE RULES
1. Stay in Character: Always respond as your character would in real life.
2. English Only: You MUST respond ONLY in English.
3. Match CEFR Level: Use vocabulary and grammar strictly at the ${difficultyLevel} level.
4. Natural and Human-like Responses: Respond like a real person would.
5. Concise and Purposeful: Make your message clear and purposeful in 1–3 sentences.
6. React Authentically: Show appropriate emotion.
7. Ask Smart Questions: Keep the conversation moving naturally.
8. Avoid Repetition: Do NOT reuse earlier expressions or repeat completed milestones.
9. Engagement First: Keep the conversation alive with curiosity.

${rules}

# SCENARIO DETAILS
- Scenario: ${scenarioDescription}
- Your Role: ${roleDescription}
- Difficulty Level: ${difficultyLevel}

${milestoneBlock}

# CONVERSATION HISTORY (Last 4 turns)
${conversationHistory}

# USER'S LATEST MESSAGE
User: "${userMessage}"

# YOUR RESPONSE (in character)
`.trim();

  return prompt;
}
}

export default new LangGraphPTHelper();
