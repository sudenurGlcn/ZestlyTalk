import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ConversationAnalysisModal = ({ isOpen, onClose, analysisData }) => {
  const navigate = useNavigate();
  
  if (!isOpen || !analysisData) return null;

  const handleGoHome = () => {
    onClose();
    navigate('/');
  };

  const { summary, recommendations, progress } = analysisData;
  
  // Progress verilerini al
  const {
    milestones = [],
    target_milestones = 0,
    percent_complete = 0,
    grammar_error_count = 0,
    vocabulary_score = 0,
    final_score = 0
  } = progress || {};

  // Skor hesaplamaları
  const completionScore = Math.round(percent_complete);
  const grammarScore = Math.max(0, 100 - (grammar_error_count * 10));
  const vocabularyScorePercent = Math.round((vocabulary_score / 5) * 100);
  const overallScore = final_score; // Backend'den gelen final_score kullanılıyor

  // Skor rengi belirleme
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
                                                                                                       className="w-full max-w-3xl max-h-[70vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#798ed9] to-[#90c3e0] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Sohbet Analizi</h2>
                  <p className="text-white/80">Performansınızın detaylı değerlendirmesi</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGoHome}
                    className="px-4 py-2 rounded-lg border border-white/30 text-white font-semibold hover:bg-white hover:text-[#798ed9] hover:border-white hover:scale-105 transition-all duration-200 shadow-md"
                  >
                    🏠 Anasayfa
                  </button>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                  >
                    <span className="material-icons text-white">close</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
                         <div className="p-6 overflow-y-auto max-h-[calc(70vh-120px)]">
                             {/* Genel Skor */}
               <div className="text-center mb-6">
                 <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#798ed9] to-[#90c3e0] mb-3">
                   <span className="text-2xl font-bold text-white">%{overallScore}</span>
                 </div>
                 <h3 className="text-lg font-semibold text-gray-800 mb-1">Genel Performans Skoru</h3>
                 <p className="text-gray-600 text-sm">
                   {overallScore >= 80 ? '🏆 Mükemmel performans!' :
                    overallScore >= 60 ? '👍 İyi bir başlangıç!' :
                    '💪 Daha fazla pratik yapmanız gerekiyor.'}
                 </p>
               </div>

                             {/* Detaylı Skorlar */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Tamamlama Skoru */}
                                 <div className={`p-3 rounded-xl border-2 ${getScoreBgColor(completionScore)} border-gray-200`}>
                   <div className="flex items-center justify-between mb-2">
                     <h4 className="font-semibold text-gray-800 text-sm">Tamamlama</h4>
                     <span className={`text-base font-bold ${getScoreColor(completionScore)}`}>
                       %{completionScore}
                     </span>
                   </div>
                   <div className="w-full bg-gray-200 rounded-full h-2">
                     <div 
                       className="bg-gradient-to-r from-[#798ed9] to-[#90c3e0] h-2 rounded-full transition-all duration-300"
                       style={{ width: `${completionScore}%` }}
                     ></div>
                   </div>
                   <p className="text-xs text-gray-600 mt-1">
                     {milestones.length}/{target_milestones} kilometre taşı tamamlandı
                   </p>
                 </div>

                                 {/* Gramer Skoru */}
                 <div className={`p-3 rounded-xl border-2 ${getScoreBgColor(grammarScore)} border-gray-200`}>
                   <div className="flex items-center justify-between mb-2">
                     <h4 className="font-semibold text-gray-800 text-sm">Gramer</h4>
                     <span className={`text-base font-bold ${getScoreColor(grammarScore)}`}>
                       %{grammarScore}
                     </span>
                   </div>
                   <div className="w-full bg-gray-200 rounded-full h-2">
                     <div 
                       className="bg-gradient-to-r from-[#798ed9] to-[#90c3e0] h-2 rounded-full transition-all duration-300"
                       style={{ width: `${grammarScore}%` }}
                     ></div>
                   </div>
                   <p className="text-xs text-gray-600 mt-1">
                     {grammar_error_count} gramer hatası tespit edildi
                   </p>
                 </div>

                                 {/* Kelime Skoru */}
                 <div className={`p-3 rounded-xl border-2 ${getScoreBgColor(vocabularyScorePercent)} border-gray-200`}>
                   <div className="flex items-center justify-between mb-2">
                     <h4 className="font-semibold text-gray-800 text-sm">Kelime Bilgisi</h4>
                     <span className={`text-base font-bold ${getScoreColor(vocabularyScorePercent)}`}>
                       %{vocabularyScorePercent}
                     </span>
                   </div>
                   <div className="w-full bg-gray-200 rounded-full h-2">
                     <div 
                       className="bg-gradient-to-r from-[#798ed9] to-[#90c3e0] h-2 rounded-full transition-all duration-300"
                       style={{ width: `${vocabularyScorePercent}%` }}
                     ></div>
                   </div>
                   <p className="text-xs text-gray-600 mt-1">
                     Kelime çeşitliliği ve kullanımı
                   </p>
                 </div>
              </div>

                             {/* Tamamlanan Kilometre Taşları */}
               {milestones.length > 0 && (
                 <div className="mb-6">
                   <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                     <span className="material-icons text-green-500">check_circle</span>
                     Tamamlanan Kilometre Taşları
                   </h4>
                   <div className="space-y-2">
                     {milestones.map((milestone, index) => (
                       <div key={index} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-200">
                         <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                           <span className="material-icons text-white text-xs">check</span>
                         </div>
                         <span className="text-xs text-gray-700">{milestone}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

                             {/* Genel Özet */}
               <div className="mb-6">
                 <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                   <span className="material-icons text-blue-500">description</span>
                   Genel Değerlendirme
                 </h4>
                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                   <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
                 </div>
               </div>

                             {/* Öneriler */}
               {recommendations && recommendations.length > 0 && (
                 <div className="mb-6">
                   <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                     <span className="material-icons text-purple-500">lightbulb</span>
                     Gelişim Önerileri
                   </h4>
                   <div className="space-y-2">
                     {recommendations.map((recommendation, index) => (
                       <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                         <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                           <span className="text-white text-xs font-bold">{index + 1}</span>
                         </div>
                         <p className="text-gray-700 leading-relaxed text-sm">{recommendation}</p>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>

                         {/* Footer */}
             <div className="bg-gray-100 px-6 py-4 border-t-2 border-gray-300">
               <div className="flex justify-end gap-3">
                 <button
                   onClick={onClose}
                   className="px-6 py-3 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-colors"
                 >
                   Kapat
                 </button>
                 <button
                   onClick={() => {
                     // Burada analiz sayfasına yönlendirme yapılabilir
                     onClose();
                   }}
                   className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#798ed9] to-[#90c3e0] text-white font-semibold hover:from-[#6a7bc0] hover:to-[#a3d2ed] transition-all duration-200 shadow-md"
                 >
                   Detaylı Rapor
                 </button>
               </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConversationAnalysisModal; 