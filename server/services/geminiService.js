// src/services/geminiService.js
import axios from 'axios';
import config from '../config/env.js';

class GeminiService {
  constructor() {
    this.client = axios.create({
      baseURL: config.gemini.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': config.gemini.apiKey,
      },
    });
  }

  async generateResponse(contents) {
    try {
      const response = await this.client.post('/models/gemini-2.0-flash:generateContent', {
        contents,
      });

      return (
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Üzgünüm, cevap oluşturulamadı.'
      );
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      console.error('❌ Gemini API Hatası:', errorMsg);
      return 'Gemini servisiyle iletişimde hata oluştu.';
    }
  }

  async generateGeminiResponse(contents) {
    try {
      const response = await this.client.post('/models/gemini-2.0-flash:generateContent', {
        contents,
      });

      return (
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Üzgünüm, cevap oluşturulamadı.'
      );
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      console.error('❌ Gemini API Hatası:', errorMsg);
      return 'Gemini servisiyle iletişimde hata oluştu.';
    }
  }
}

export default new GeminiService();
