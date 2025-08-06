import React, { useState } from 'react';

const InteractiveMessage = ({ message, isUserMessage = false }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);

  // Metni analiz verilerine göre parçalara ayır
  const renderTextWithHighlights = () => {
    if (!message.analysis) {
      return <span>{message.text}</span>;
    }

    let text = message.text;
    const highlights = [];

    // Vocabulary highlights
    if (message.analysis.vocabulary) {
      message.analysis.vocabulary.forEach((vocab, index) => {
        const word = vocab.original_word;
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = text.match(regex);
        
        if (matches) {
          matches.forEach((match, matchIndex) => {
            const startIndex = text.toLowerCase().indexOf(match.toLowerCase());
            if (startIndex !== -1) {
              highlights.push({
                type: 'vocabulary',
                word: match,
                start: startIndex,
                end: startIndex + match.length,
                suggestions: vocab.suggestions,
                index: index
              });
              // Kelimeyi text'ten çıkar ki tekrar bulunmasın
              text = text.substring(0, startIndex) + ' '.repeat(match.length) + text.substring(startIndex + match.length);
            }
          });
        }
      });
    }

    // Grammar highlights
    if (message.analysis.grammar) {
      message.analysis.grammar.forEach((grammar, index) => {
        const error = grammar.error;
        const suggestion = grammar.suggestion;
        
        // Hata olan kısmı bul
        const errorWords = error.split(' ');
        errorWords.forEach(word => {
          const regex = new RegExp(`\\b${word}\\b`, 'gi');
          const matches = text.match(regex);
          
          if (matches) {
            matches.forEach((match, matchIndex) => {
              const startIndex = text.toLowerCase().indexOf(match.toLowerCase());
              if (startIndex !== -1) {
                highlights.push({
                  type: 'grammar',
                  word: match,
                  start: startIndex,
                  end: startIndex + match.length,
                  error: grammar.error,
                  suggestion: grammar.suggestion,
                  topic: grammar.topic,
                  explanation: grammar.explanation,
                  index: index
                });
                text = text.substring(0, startIndex) + ' '.repeat(match.length) + text.substring(startIndex + match.length);
              }
            });
          }
        });
      });
    }

    // Fluency highlights
    if (message.analysis.fluency) {
      message.analysis.fluency.forEach((fluency, index) => {
        const original = fluency.original;
        
        // Orijinal cümleyi bul
        const originalWords = original.split(' ');
        originalWords.forEach(word => {
          const regex = new RegExp(`\\b${word}\\b`, 'gi');
          const matches = text.match(regex);
          
          if (matches) {
            matches.forEach((match, matchIndex) => {
              const startIndex = text.toLowerCase().indexOf(match.toLowerCase());
              if (startIndex !== -1) {
                highlights.push({
                  type: 'fluency',
                  word: match,
                  start: startIndex,
                  end: startIndex + match.length,
                  original: fluency.original,
                  suggestion: fluency.suggestion,
                  explanation: fluency.explanation,
                  index: index
                });
                text = text.substring(0, startIndex) + ' '.repeat(match.length) + text.substring(startIndex + match.length);
              }
            });
          }
        });
      });
    }

    // Highlights'ları sırala
    highlights.sort((a, b) => a.start - b.start);

    // Metni parçalara ayır
    const parts = [];
    let lastIndex = 0;

    highlights.forEach((highlight, index) => {
      // Highlight'tan önceki kısım
      if (highlight.start > lastIndex) {
        parts.push({
          type: 'text',
          content: message.text.substring(lastIndex, highlight.start)
        });
      }

      // Highlight
      parts.push({
        type: 'highlight',
        content: message.text.substring(highlight.start, highlight.end),
        highlight: highlight
      });

      lastIndex = highlight.end;
    });

    // Son kısım
    if (lastIndex < message.text.length) {
      parts.push({
        type: 'text',
        content: message.text.substring(lastIndex)
      });
    }

    return parts.map((part, index) => {
      if (part.type === 'text') {
        return <span key={index}>{part.content}</span>;
      } else {
        return (
                     <span
             key={index}
                           className={`cursor-pointer px-1 rounded transition-colors ${
                part.highlight.type === 'vocabulary' 
                  ? 'bg-yellow-200 hover:bg-yellow-300' 
                  : part.highlight.type === 'grammar'
                  ? 'bg-red-200 hover:bg-red-300'
                  : 'bg-blue-200 hover:bg-blue-300'
              }`}
             onClick={() => setSelectedWord(part.highlight)}
             title={`${
                part.highlight.type === 'vocabulary' ? 'Kelime önerisi' 
                : part.highlight.type === 'grammar' ? 'Dilbilgisi önerisi'
                : 'Akıcılık önerisi'
              } için tıklayın`}
           >
            {part.content}
          </span>
        );
      }
    });
  };

  return (
    <div className="relative">
      <div className="text-sm leading-relaxed">
        {renderTextWithHighlights()}
      </div>
      
      {/* Analysis gösterme butonu */}
      {message.analysis && (
        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
        >
          {showAnalysis ? 'Analizi gizle' : 'Analizi göster'}
        </button>
      )}

      {/* Analysis paneli */}
      {showAnalysis && message.analysis && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                     {/* Grammar Analysis */}
           {message.analysis.grammar && message.analysis.grammar.length > 0 && (
             <div className="mb-3">
                               <h4 className="text-sm font-semibold mb-2 text-red-700">
                  📝 Dilbilgisi Önerileri:
                </h4>
                {message.analysis.grammar.map((item, index) => (
                  <div key={index} className="mb-2 p-2 bg-white rounded border-l-4 border-red-400">
                  <div className="text-xs text-gray-600 mb-1">
                    <strong>Konu:</strong> {item.topic}
                  </div>
                  <div className="text-xs mb-1">
                    <span className="text-red-600">Hata:</span> {item.error}
                  </div>
                  <div className="text-xs mb-1">
                    <span className="text-green-600">Öneri:</span> {item.suggestion}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}

                     {/* Vocabulary Analysis */}
           {message.analysis.vocabulary && message.analysis.vocabulary.length > 0 && (
             <div className="mb-3">
                               <h4 className="text-sm font-semibold mb-2 text-yellow-700">
                  📚 Kelime Önerileri:
                </h4>
                {message.analysis.vocabulary.map((item, index) => (
                  <div key={index} className="mb-2 p-2 bg-white rounded border-l-4 border-yellow-400">
                    <div className="text-xs mb-1">
                      <span className="text-yellow-600">Kelime:</span> {item.original_word}
                    </div>
                  <div className="text-xs">
                    <span className="text-green-600">Öneriler:</span>
                    <ul className="list-disc list-inside mt-1">
                      {item.suggestions.map((suggestion, sIndex) => (
                        <li key={sIndex} className="text-xs">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

                     {/* Fluency Analysis */}
           {message.analysis.fluency && message.analysis.fluency.length > 0 && (
             <div>
                               <h4 className="text-sm font-semibold mb-2 text-blue-700">
                  🎯 Akıcılık Önerileri:
                </h4>
                {message.analysis.fluency.map((item, index) => (
                  <div key={index} className="mb-2 p-2 bg-white rounded border-l-4 border-blue-400">
                    <div className="text-xs mb-1">
                      <span className="text-blue-600">Orijinal:</span> {item.original}
                    </div>
                    <div className="text-xs mb-1">
                      <span className="text-green-600">Öneri:</span> {item.suggestion}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      )}

      {/* Seçili kelime modal'ı */}
      {selectedWord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedWord.type === 'vocabulary' ? '📚 Kelime Önerisi' 
                 : selectedWord.type === 'grammar' ? '📝 Dilbilgisi Önerisi'
                 : '🎯 Akıcılık Önerisi'}
              </h3>
              <button
                onClick={() => setSelectedWord(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {selectedWord.type === 'vocabulary' ? (
              <div>
                <p className="text-sm mb-3">
                  <strong>Kelime:</strong> {selectedWord.word}
                </p>
                <p className="text-sm mb-3">
                  <strong>Öneriler:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {selectedWord.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-green-600">{suggestion}</li>
                  ))}
                </ul>
              </div>
            ) : selectedWord.type === 'grammar' ? (
              <div>
                <p className="text-sm mb-2">
                  <strong>Konu:</strong> {selectedWord.topic}
                </p>
                <p className="text-sm mb-2">
                  <span className="text-red-600">Hata:</span> {selectedWord.error}
                </p>
                <p className="text-sm mb-2">
                  <span className="text-green-600">Öneri:</span> {selectedWord.suggestion}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedWord.explanation}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm mb-2">
                  <span className="text-blue-600">Orijinal:</span> {selectedWord.original}
                </p>
                <p className="text-sm mb-2">
                  <span className="text-green-600">Öneri:</span> {selectedWord.suggestion}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedWord.explanation}
                </p>
              </div>
            )}
            
            <button
              onClick={() => setSelectedWord(null)}
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMessage; 