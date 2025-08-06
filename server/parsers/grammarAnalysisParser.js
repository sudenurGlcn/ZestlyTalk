// src/parsers/grammarAnalysisParser.js

class GrammarAnalysisParser {
  static parseResponse(responseText) {
    if (!responseText) return [];

    try {
      const jsonStart = responseText.indexOf('[');
      const jsonEnd = responseText.lastIndexOf(']');
      const jsonString = responseText.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonString);

      return Array.isArray(parsed)
        ? parsed
            .filter(item =>
              item &&
              typeof item === 'object' &&
              (
                (item.suggestion && item.suggestion.trim() !== '') ||
                (item.explanation && item.explanation.trim() !== '') ||
                (item.topic && item.topic.trim() !== '')
              ) &&
              item.explanation?.trim() !== 'The sentence is grammatically correct.'
            )
            .map(item => ({
              error: item.error || '',
              suggestion: item.suggestion || '',
              topic: item.topic || 'Unknown',
              explanation: item.explanation || '',
            }))
        : [];
    } catch (err) {
      console.error('GrammarAnalysisParser: JSON ayrıştırma hatası:', err);
      return [];
    }
  }
}
export default GrammarAnalysisParser;
