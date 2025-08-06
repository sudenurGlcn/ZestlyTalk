import axios from 'axios';
import config from '../config/env.js';

const geminiApi = axios.create({
  baseURL: config.gemini.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'X-goog-api-key': config.gemini.apiKey,
  },
});

/**
 * Gemini API ile içerik oluşturur
 * @param {string} prompt - Kullanıcının girdisi
 * @returns {Promise<string>} - Gemini'nin cevabı
 */
export async function generateGeminiResponse(prompt) {
  try {
    const response = await geminiApi.post('/models/gemini-2.0-flash:generateContent', {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || 'Üzgünüm, cevap oluşturulamadı.';
  } catch (err) {
    const errorMsg = err.response?.data?.error?.message || err.message;
    console.error('❌ Gemini API Hatası:', errorMsg);
    return 'Gemini servisiyle iletişimde hata oluştu.';
  }
}
