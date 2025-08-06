import React from 'react';

const RadarChart = ({ data, period }) => {
  if (!data) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Henüz Veri Yok</h3>
        <p className="text-gray-500">
          Dil beceri skorları henüz mevcut değil.
        </p>
      </div>
    );
  }

  const { grammar, vocabulary, task_completion } = data;

  // Yeni kullanıcı kontrolü - tüm değerler 0 ise
  const isNewUser = grammar === 0 && vocabulary === 0 && task_completion === 0;

  // Yeni kullanıcı kontrolü - tüm değerler 0 ise
  if (isNewUser) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-r from-[#798ed9] to-[#90c3e0] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">🎯</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Dil Beceri Analizi</h3>
        <p className="text-gray-500 mb-4">
          Henüz herhangi bir sohbet tamamlamadınız. <br/>
          Analiz yapabilmek için önce bir sohbet üzerinde çalışmalısınız.
        </p>
      </div>
    );
  }

  // Skorları 0-100 aralığına normalize et
  const normalizedGrammar = Math.max(0, 100 - (grammar * 10)); // Grammar hataları azaldıkça skor artar
  const normalizedVocab = Math.min(100, vocabulary);
  const normalizedTask = Math.min(100, task_completion);

  return (
    <div className="space-y-6">
      {/* Başlık ve Özet */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Dil Beceri Analizi
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((normalizedGrammar + normalizedVocab + normalizedTask) / 3)}
            </div>
            <div className="text-sm text-gray-600">Ortalama Skor</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-700">{period === "weekly" ? "Haftalık" : "Aylık"} analiz</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            <span className="text-gray-700">Gerçek zamanlı skorlar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span className="text-gray-700">Kişiselleştirilmiş</span>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Beceri Dağılımı</h3>
        
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            {/* Radar Chart Background */}
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {/* Background circles */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              <circle cx="100" cy="100" r="60" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              <circle cx="100" cy="100" r="40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              <circle cx="100" cy="100" r="20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              
              {/* Axes */}
              <line x1="100" y1="20" x2="100" y2="180" stroke="#e5e7eb" strokeWidth="1"/>
              <line x1="20" y1="100" x2="180" y2="100" stroke="#e5e7eb" strokeWidth="1"/>
              <line x1="35" y1="35" x2="165" y2="165" stroke="#e5e7eb" strokeWidth="1"/>
              <line x1="165" y1="35" x2="35" y2="165" stroke="#e5e7eb" strokeWidth="1"/>
              
              {/* Data points */}
              <circle cx="100" cy={100 - (normalizedGrammar * 0.6)} r="4" fill="#8b5cf6"/>
              <circle cx={100 + (normalizedVocab * 0.6)} cy="100" r="4" fill="#ec4899"/>
              <circle cx="100" cy={100 + (normalizedTask * 0.6)} r="4" fill="#3b82f6"/>
              
              {/* Radar area */}
              <polygon 
                points={`100,${100 - (normalizedGrammar * 0.6)} ${100 + (normalizedVocab * 0.6)},100 100,${100 + (normalizedTask * 0.6)}`}
                fill="rgba(139, 92, 246, 0.2)"
                stroke="#8b5cf6"
                strokeWidth="2"
              />
            </svg>
            
            {/* Labels */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="text-center">
                <div className="text-sm font-semibold text-purple-600">Dilbilgisi</div>
                <div className="text-xs text-gray-500">{Math.round(normalizedGrammar)}%</div>
              </div>
            </div>
            <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2">
              <div className="text-center">
                <div className="text-sm font-semibold text-pink-600">Kelime Bilgisi</div>
                <div className="text-xs text-gray-500">{Math.round(normalizedVocab)}%</div>
              </div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
              <div className="text-center">
                <div className="text-sm font-semibold text-blue-600">Görev Tamamlama</div>
                <div className="text-xs text-gray-500">{Math.round(normalizedTask)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detaylı Skorlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{Math.round(normalizedGrammar)}%</div>
            <div className="text-sm text-gray-600">Dilbilgisi</div>
            <div className="text-xs text-gray-500 mt-1">
              {grammar > 0 ? `${grammar.toFixed(1)} ortalama hata` : 'Mükemmel'}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600 mb-1">{Math.round(normalizedVocab)}%</div>
            <div className="text-sm text-gray-600">Kelime Bilgisi</div>
            <div className="text-xs text-gray-500 mt-1">
              {vocabulary > 0 ? `${vocabulary.toFixed(1)} kelime skoru` : 'Geliştirilmeli'}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{Math.round(normalizedTask)}%</div>
            <div className="text-sm text-gray-600">Görev Tamamlama</div>
            <div className="text-xs text-gray-500 mt-1">
              {task_completion > 0 ? `${task_completion.toFixed(1)}% tamamlanma` : 'Başlanmamış'}
            </div>
          </div>
        </div>
      </div>

      {/* Öneriler */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Gelişim Önerileri</h3>
        
        <div className="space-y-3">
          {normalizedGrammar < 70 && (
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📝</span>
              </div>
              <div>
                <div className="font-semibold text-red-800">Dilbilgisi Geliştirme</div>
                <div className="text-sm text-red-600">Daha fazla pratik yaparak dilbilgisi hatalarınızı azaltabilirsiniz.</div>
              </div>
            </div>
          )}
          
          {normalizedVocab < 70 && (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📚</span>
              </div>
              <div>
                <div className="font-semibold text-yellow-800">Kelime Bilgisi</div>
                <div className="text-sm text-yellow-600">Yeni kelimeler öğrenerek kelime dağarcığınızı genişletebilirsiniz.</div>
              </div>
            </div>
          )}
          
          {normalizedTask < 70 && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🎯</span>
              </div>
              <div>
                <div className="font-semibold text-blue-800">Görev Tamamlama</div>
                <div className="text-sm text-blue-600">Sohbetleri tamamlayarak görev tamamlama oranınızı artırabilirsiniz.</div>
              </div>
            </div>
          )}
          
          {(normalizedGrammar >= 70 && normalizedVocab >= 70 && normalizedTask >= 70) && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🏆</span>
              </div>
              <div>
                <div className="font-semibold text-green-800">Mükemmel Performans!</div>
                <div className="text-sm text-green-600">Tüm alanlarda çok iyi performans gösteriyorsunuz. Tebrikler!</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RadarChart; 