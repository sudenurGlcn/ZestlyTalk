// src/parsers/vocabularyAnalysisParser.js

class VocabularyAnalysisParser {
  static parseResponse(responseText) {
    if (!responseText) return [];

    try {
      const jsonStart = responseText.indexOf('[');
      const jsonEnd = responseText.lastIndexOf(']');
      const jsonString = responseText.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonString);

      return Array.isArray(parsed)
        ? parsed.map(item => ({
            original_word: item.original_word || '',
            suggestions: item.suggestions || [],
            context: item.context || '',
          }))
        : [];
    } catch (err) {
      console.error('VocabularyAnalysisParser: JSON ayrıştırma hatası:', err);
      return [];
    }
  }
}

export default VocabularyAnalysisParser;
