import geminiService from '../services/geminiService.js';

export async function summarizeMessages(messages) {
  // messages: [{sender, message, timestamp}, ...]

  if (messages.length === 0) return '';

  // Özetleme promptu hazırla
  const textToSummarize = messages
    .map(msg => `${msg.sender === 'user' ? 'Kullanıcı' : 'Agent'}: ${msg.message}`)
    .join('\n');

  // Burada Gemini API'den özet alıyoruz
  const prompt = `Aşağıdaki sohbet geçmişini kısaca özetle:\n${textToSummarize}\nÖzet:`;

  // GeminiService'i kullanarak özet isteği
  const response = await geminiService.generateResponse([{ parts: [{ text: prompt }] }]);

  return response || '';
}
