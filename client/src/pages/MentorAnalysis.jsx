import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getMentorTips } from "../store/scenarioSlice";
import { selectUserInfo } from "../store/userSlice";

export default function MentorAnalysis() {
  const [testAnswers, setTestAnswers] = useState({});
  const [showTestResults, setShowTestResults] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const { mentorTips, isLoading, error } = useSelector((state) => state.scenario);

  // Mentor tips'i yükle
  useEffect(() => {
    if (userInfo?.id) {
      dispatch(getMentorTips(userInfo.id));
    }
  }, [userInfo?.id, dispatch]);

  // Test cevabı seçme fonksiyonu
  const handleAnswerSelect = (selectedOption) => {
    setTestAnswers(prev => ({
      ...prev,
      [currentQuestion]: selectedOption
    }));
  };

  // Test sonuçlarını hesaplama
  const calculateTestResults = () => {
    if (!mentorTips?.mini_test) return;

    let correctAnswers = 0;
    const totalQuestions = mentorTips.mini_test.length;

    mentorTips.mini_test.forEach((question, index) => {
      const userAnswer = testAnswers[index];
      const correctAnswer = question.answer;
      
      if (userAnswer === correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    setTestScore(score);
    setShowTestResults(true);
  };

  // Test'i sıfırlama
  const resetTest = () => {
    setTestAnswers({});
    setShowTestResults(false);
    setTestScore(0);
    setCurrentQuestion(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b4e3fd] via-[#c0defb] to-[#dfd6f6]">
      {/* Navbar */}
      <Navbar />

      {/* Ana İçerik */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-2">
        <div className="w-full max-w-6xl bg-white/90 rounded-2xl shadow-xl border border-white/30 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mentor Analizi</h1>
            <p className="text-gray-600">Kişiselleştirilmiş öneriler ve gelişim tavsiyeleri</p>
          </div>

          {/* Loading Durumu */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7e90d0] mx-auto mb-4"></div>
              <p className="text-gray-600">Mentor önerileri yükleniyor...</p>
            </div>
          )}

          {/* Error Durumu */}
          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Hata Oluştu</h3>
              <p className="text-red-500">
                {typeof error === 'string' ? error : 'Mentor önerileri yüklenirken bir hata oluştu.'}
              </p>
            </div>
          )}

          {/* Mentor Tips Verisi */}
          {mentorTips && !isLoading && !error && (
            <div className="space-y-8">
              {/* Dilbilgisi Özeti */}
              <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Dilbilgisi Özeti
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">
                    {mentorTips.grammar_summary || "Henüz dilbilgisi özeti bulunmuyor."}
                  </p>
                </div>
              </div>

              {/* Kelime Önerisi */}
              <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  Kelime Önerisi
                </h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">
                    {mentorTips.vocabulary_tip || "Henüz kelime önerisi bulunmuyor."}
                  </p>
                </div>
              </div>

              {/* Mini Test */}
              {mentorTips.mini_test && mentorTips.mini_test.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  {/* Test Header */}
                  <div className="bg-gradient-to-r from-[#798ed9] to-[#90c3e0] p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold">Mini Test</h2>
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-2xl opacity-80">quiz</span>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm">Mentor önerilerinize göre hazırlanmış kişiselleştirilmiş test</p>
                  </div>

                  {/* Test İçeriği */}
                  <div className="p-6">
                    {!showTestResults ? (
                      <>
                        {/* Soru İlerleme Göstergesi */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-lg text-gray-600">question_answer</span>
                            <span className="text-sm font-medium text-gray-600">
                              Soru {currentQuestion + 1} / {mentorTips.mini_test.length}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {mentorTips.mini_test.map((_, index) => (
                              <div
                                key={index}
                                className={`w-3 h-3 rounded-full ${
                                  index === currentQuestion
                                    ? 'bg-[#798ed9]'
                                    : testAnswers[index] !== undefined
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>

                        {/* Soru */}
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            {mentorTips.mini_test[currentQuestion].question}
                          </h3>
                          <div className="space-y-3">
                            {mentorTips.mini_test[currentQuestion].options.map((option, index) => (
                              <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                                  testAnswers[currentQuestion] === option
                                    ? 'border-[#798ed9] bg-[#eaf0fb] text-[#798ed9]'
                                    : 'border-gray-200 hover:border-[#798ed9] hover:bg-gray-50'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Navigasyon Butonları */}
                        <div className="flex justify-between">
                          <button
                            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                            disabled={currentQuestion === 0}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                              currentQuestion === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-500 text-white hover:bg-gray-600'
                            }`}
                          >
                            Önceki
                          </button>
                          
                          {currentQuestion < mentorTips.mini_test.length - 1 ? (
                            <button
                              onClick={() => setCurrentQuestion(currentQuestion + 1)}
                              disabled={!testAnswers[currentQuestion]}
                              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                                !testAnswers[currentQuestion]
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-[#798ed9] text-white hover:bg-[#6a7bc0]'
                              }`}
                            >
                              Sonraki
                            </button>
                          ) : (
                            <button
                              onClick={calculateTestResults}
                              disabled={!testAnswers[currentQuestion]}
                              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                                !testAnswers[currentQuestion]
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-green-500 text-white hover:bg-green-600'
                              }`}
                            >
                              Testi Bitir
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      /* Test Sonuçları */
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-[#798ed9] to-[#90c3e0] rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-white">%{testScore}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Test Sonucunuz</h3>
                        <p className="text-gray-600 mb-6">
                          {testScore >= 80 ? '🏆 Mükemmel! Çok iyi bir performans gösterdiniz.' :
                           testScore >= 60 ? '👍 İyi! Biraz daha pratik yapmanız gerekiyor.' :
                           '💪 Daha fazla çalışmanız gerekiyor. Pes etmeyin!'}
                        </p>
                        <button
                          onClick={resetTest}
                          className="px-6 py-3 bg-[#798ed9] text-white rounded-lg font-semibold hover:bg-[#6a7bc0] transition-all duration-200"
                        >
                          Testi Tekrar Çöz
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 