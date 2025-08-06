// src/agents/grammarAnalysisAgent.js
import AgentBase from './agentBase.js';
import GeminiService from '../services/geminiService.js';
import GrammarAnalysisParser from '../parsers/grammarAnalysisParser.js';

export default class GrammarAnalysisAgent extends AgentBase {
  constructor() {
    super('GrammarAnalysisAgent');
  }

  async handleRequest({ text }) {
    if (!text || typeof text !== 'string') {
      console.warn('GrammarAnalysisAgent: Geçersiz metin girdisi');
      return [];
    }

const prompt = `
You are a grammar analysis agent in a personalized English learning system.

Your task is to carefully analyze the following English text and detect all grammar mistakes. For each mistake, return a structured JSON object including:

- "error": The incorrect phrase or sentence
- "suggestion": The corrected version
- "topic": The grammar topic it belongs to (e.g., "Past Perfect Tense", "Prepositions", "Irregular Verbs")
- "explanation": A brief explanation of the mistake (why it’s incorrect)

Only return the result as a valid JSON array, like the example format below. Do not include any explanations outside the JSON.

*Instructions:*
- Ignore missing final punctuation in short single-sentence informal messages unless it causes ambiguity or confusion.
- Do not suggest expansions like "I'm" → "I am" if both are grammatically correct and the contraction is acceptable in context.

Text to analyze:
"${text}"

Format:
[
  {
    "error": "I have went to school.",
    "suggestion": "I have gone to school.",
    "topic": "Irregular Verbs - Past Participle",
    "explanation": "The past participle of 'go' is 'gone', not 'went'."
  },
  ...
]
`.trim();

    const rawResponse = await GeminiService.generateGeminiResponse([
      { parts: [{ text: prompt }] }
    ]);

    return GrammarAnalysisParser.parseResponse(rawResponse);
  }
}
