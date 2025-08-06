import AgentBase from './agentBase.js';
import RoleplayAgent from './roleplayAgent.js';
import GrammarAnalysisAgent from './grammarAnalysisAgent.js';
import VocabularyAnalysisAgent from './vocabularyAnalysisAgent.js';
import { runConcurrent } from '../utils/concurrencyRunner.js';
import FluencyAgent from './fluencyAgent.js';
import ConversationSummaryAgent from './conversationSummaryAgent.js';
import db from '../models/index.js';
import HintAgent from './hintAgent.js';
import MentorAgent from './mentorAgent.js';
import MilestoneCheckAgent from './milestoneCheckAgent.js';
import VocabularyLevelAgent from './vocabularyLevelAgent.js';
import FreeTalkAgent from './freeTalkAgent.js'; // üst kısma ekle
import ChatMessageService from '../services/chatMessageService.js';

export default class CoordinatorAgent extends AgentBase {
  constructor() {
    super('CoordinatorAgent');
  }

  /**
   * Görevleri yerel agentlerle paralel çalıştırır
   * @param {Object} param0
   * @param {number} param0.userId
   * @param {number} param0.chatId
   * @param {string} param0.userMessage
   * @param {Object} param0.context
   * @returns {Promise<Object>}
   */
  async handleRequest({ userId, chatId, userMessage, context }) {
    const enrichedContext = { ...context };

    const milestoneAgent = new MilestoneCheckAgent();

    const tasks = [
      () =>
        new RoleplayAgent().handleRequest({
          userId,
          chatId,
          userMessage,
          context: enrichedContext,
        }),
      () => new GrammarAnalysisAgent().handleRequest({ text: userMessage }),
      () => new VocabularyAnalysisAgent().handleRequest({ text: userMessage, chatId, context: enrichedContext }),
      () => new FluencyAgent().handleRequest({ text: userMessage }),
      () => milestoneAgent.handleRequest({ chatId, userMessage }), // ✅ milestone DB'ye progress yazar
    ];

    // 5 task paralel çalıştırılır
    const [roleplayResp, grammarResp, vocabResp, fluencyResp] = await runConcurrent(tasks, 5);

    return {
      response: roleplayResp,
      analysis: {
        grammar: grammarResp,
        vocabulary: vocabResp,
        fluency: fluencyResp,
      },
    };
  }

  /**
   * Konuşma sonunda agent analizlerini paralel çalıştırır
   * @param {Object} param0
   * @param {number} param0.userId
   * @param {number} param0.chatId
   * @returns {Promise<Object>}
   */
async handleConversationEnd({ userId, chatId }) {
  const summaryAgent = new ConversationSummaryAgent();
  const vocabLevelAgent = new VocabularyLevelAgent();

  const tasks = [
    () => summaryAgent.handleRequest({ userId, chatId }),
    () => vocabLevelAgent.handleRequest({ chatId }),
  ];

  const [summaryResult, vocabLevelResult] = await runConcurrent(tasks, 2);

  const grammarErrorCount = await db.GrammarError.count({ where: { chat_id: chatId } });

  const chat = await db.Chat.findByPk(chatId, {
    include: {
      model: db.Scenario,
      as: 'scenario',
      attributes: ['difficulty_level'],
    },
  });

  const progress = chat.progress || {};
  const milestoneScore = progress.percent_complete || 0;

  const userLevel = vocabLevelResult.averageLevel || 0;
  const targetLevel = levelToNumeric(chat?.scenario?.difficulty_level || 'A1');

  const vocabularyScore = computeVocabularyScore(userLevel, targetLevel);

  const grammarPenalty = Math.min(grammarErrorCount * 5, 100);
  const grammarScore = 100 - grammarPenalty;

 const rawScore = Math.round(
  milestoneScore * 0.6 +
  vocabularyScore * 0.2 +
  grammarScore * 0.2
);
const finalScore = Math.min(rawScore, 100);

  const newStatus = finalScore >= 85 ? 'completed' : 'active';

  const updatedProgress = {
    ...progress,
    recommendations: summaryResult.recommendations,
    vocabulary_score: userLevel,
    grammar_error_count: grammarErrorCount,
    final_score: finalScore,
    status: newStatus,
  };

  await db.Chat.update({
    completed_at: new Date(),
    score: finalScore,
    status: newStatus,
    feedback: summaryResult.summary,
    progress: updatedProgress,
  }, {
    where: { id: chatId }
  });

  return {
    summary: summaryResult.summary,
    recommendations: summaryResult.recommendations,
    progress: {
      milestones: updatedProgress.milestones || [],
      target_milestones: updatedProgress.target_milestones || 0,
      percent_complete: updatedProgress.percent_complete || 0,
      vocabulary_score: updatedProgress.vocabulary_score || 0,
      grammar_error_count: updatedProgress.grammar_error_count || 0,
      final_score: updatedProgress.final_score || 0,
      status: updatedProgress.status || newStatus,
    }
  };
}


  async handleHintRequest({ chatId }) {
    const hintAgent = new HintAgent();
    return await hintAgent.handleRequest({ chatId });
  }

  async handleMentorshipRequest({ userId, chatId }) {
    const mentorAgent = new MentorAgent();
    return await mentorAgent.handleRequest({ userId, chatId });
  }

  /**
 * Serbest Sohbet Agent’ı çalıştırır
 * @param {Object} param0
 * @param {number} param0.userId
 * @param {number} param0.chatId
 * @param {string} param0.userMessage
 * @returns {Promise<Object>}
 */
async handleFreeTalk({ userId, chatId, userMessage, chatHistory }) {
  if (!userId || !chatId || !userMessage) {
    throw new Error('userId, chatId ve userMessage zorunludur');
  }

  // Kullanıcı mesajını kaydet
  await ChatMessageService.createMessage({
    chat_id: chatId,
    sender: 'user',
    message: userMessage,
  });

  const freeTalkAgent = new FreeTalkAgent();
  const response = await freeTalkAgent.handleRequest({
    userId,
    chatId,
    userMessage,
    chatHistory,
  });

  await ChatMessageService.createMessage({
    chat_id: chatId,
    sender: 'agent',
    message: response,
  });

  return { response };
}

}

function levelToNumeric(level) {
  const map = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 5 };
  return map[level.toUpperCase()] || 1;
}

function computeVocabularyScore(userLevel, targetLevel) {
  const baseScore = 100;
  const diff = userLevel - targetLevel;

  if (diff === 0) return baseScore;
  if (diff < 0) return Math.max(baseScore + diff * 15, 20); // alt seviyedeyse puan kırılır
  if (diff > 0) return Math.min(baseScore + diff * 10, 120); // üst seviyedeyse ödüllendirilir
}
