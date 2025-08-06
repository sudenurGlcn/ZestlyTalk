import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserLevel } from '../store/userSlice';
import { 
  testsByLevel, 
  levelDetectionTest, 
  beginnerTests, 
  intermediateTests, 
  upperIntermediateTests, 
  advancedTests 
} from '../constants/testQuestions';
import Navbar from '../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { getNextLevel } from '../utils/levelUtils';
import Swal from 'sweetalert2';

const Tests = () => {
  const userLevel = useSelector(selectUserLevel);
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Tüm testleri al (kilitli olanlar da görünecek)
  const getAvailableTests = () => {
    // Seviye tespit testi her zaman açık
    const allTests = [levelDetectionTest];
    
    // Tüm seviyelerdeki testleri ekle
    const allLevelTests = [
      ...beginnerTests,
      ...intermediateTests,
      ...upperIntermediateTests,
      ...advancedTests
    ];
    
    allTests.push(...allLevelTests);
    
    return allTests;
  };

  const availableTests = getAvailableTests();

  // Filtreleme fonksiyonu
  const getFilteredTests = () => {
    if (selectedFilter === 'all') {
      return availableTests;
    }
    
    return availableTests.filter(test => {
      if (selectedFilter === 'level-detection') {
        return test.id === 'level-detection';
      }
      if (selectedFilter === 'beginner') {
        return test.id.includes('beginner');
      }
      if (selectedFilter === 'intermediate') {
        return test.id.includes('intermediate') && !test.id.includes('upper');
      }
      if (selectedFilter === 'upper-intermediate') {
        return test.id.includes('upper-intermediate');
      }
      if (selectedFilter === 'advanced') {
        return test.id.includes('advanced');
      }
      return true;
    });
  };

  const filteredTests = getFilteredTests();

  const getLevelColor = (level) => {
    const colors = {
      'A1': 'bg-green-100 text-green-800 border-green-200',
      'A2': 'bg-blue-100 text-blue-800 border-blue-200',
      'B1': 'bg-purple-100 text-purple-800 border-purple-200',
      'B2': 'bg-red-100 text-red-800 border-red-200',
      'C1': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'C2': 'bg-pink-100 text-pink-800 border-pink-200',
      'beginner': 'bg-green-100 text-green-800 border-green-200',
      'intermediate': 'bg-blue-100 text-blue-800 border-blue-200',
      'upper-intermediate': 'bg-purple-100 text-purple-800 border-purple-200',
      'advanced': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[level] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getLevelText = (level) => {
    const texts = {
      'A1': 'A1 Başlangıç',
      'A2': 'A2 Temel',
      'B1': 'B1 Orta',
      'B2': 'B2 İleri Orta',
      'C1': 'C1 İleri',
      'C2': 'C2 Çok İleri',
      'beginner': 'Başlangıç',
      'intermediate': 'Orta',
      'upper-intermediate': 'İleri Orta',
      'advanced': 'İleri'
    };
    return texts[level] || 'Belirtilmemiş';
  };

  const handleStartTest = async (test) => {
    // Test başlatma modal'ı göster
    const result = await Swal.fire({
      title: '',
      html: `
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-[#798ed9] to-[#90c3e0] rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-white text-2xl">✍️</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">${test.title}</h3>
          <p class="text-gray-600 mb-4">
            Bu testi başlatmak istediğinize emin misiniz?
          </p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            <div class="flex items-center gap-2 mb-1">
              <span class="material-icons text-blue-600">schedule</span>
              <span>Süre: ${test.duration} dakika</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="material-icons text-blue-600">question_answer</span>
              <span>Soru Sayısı: ${test.questions.length}</span>
            </div>
          </div>
        </div>
      `,
      icon: 'none',
      showCancelButton: true,
      confirmButtonText: 'Testi Başlat',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#798ed9',
      cancelButtonColor: '#6b7280',
      buttonsStyling: false,
      customClass: {
        title: 'text-xl font-bold text-gray-800',
        htmlContainer: 'text-gray-600 leading-relaxed',
        confirmButton: 'swal2-confirm-custom  mr-6 px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 text-white bg-gradient-to-r from-[#798ed9] to-[#90c3e0]',
        cancelButton: 'swal2-cancel-custom gap-2 px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 text-white bg-gradient-to-r from-[#798ed9] to-[#90c3e0]'
      }
    });

    if (result.isConfirmed) {
      // Test sayfasına yönlendir ve test bilgilerini state'e kaydet
      navigate('/test', { 
        state: { 
          testData: test,
          isLevelDetection: test.id === 'level-detection'
        } 
      });
    }
  };

  const isTestLocked = (test) => {
    // Seviye tespit testi her zaman açık
    if (test.id === 'level-detection') return false;
    
    // Kullanıcının seviyesi yoksa tüm testler kilitli
    if (!userLevel) return true;
    
    // Testin hangi seviyeye ait olduğunu kontrol et
    const testLevel = getTestLevel(test.id);
    
    // Kullanıcının seviyesi test seviyesinden düşükse kilitli
    return !isLevelSufficient(userLevel, testLevel);
  };

  const getTestLevelText = (testId) => {
    if (testId.includes('beginner')) return 'Başlangıç Seviyesi';
    if (testId.includes('intermediate')) return 'Orta Seviye';
    if (testId.includes('upper-intermediate')) return 'İleri Orta Seviye';
    if (testId.includes('advanced')) return 'İleri Seviye';
    return 'Başlangıç Seviyesi';
  };

  const getTestLevel = (testId) => {
    if (testId.includes('advanced')) return 'advanced';
    if (testId.includes('upper-intermediate')) return 'upper-intermediate';
    if (testId.includes('intermediate')) return 'intermediate';
    if (testId.includes('beginner')) return 'beginner';
    return 'beginner';
  };

  const isLevelSufficient = (userLevel, testLevel) => {
    // CEFR seviyelerini sıralı hale getir
    const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const oldLevels = ['beginner', 'intermediate', 'upper-intermediate', 'advanced'];
    
    // Kullanıcının seviyesi CEFR formatında mı kontrol et
    if (cefrLevels.includes(userLevel)) {
      // Test seviyesini CEFR'e çevir
      const testLevelMapping = {
        'beginner': 'A1',
        'intermediate': 'A2', 
        'upper-intermediate': 'B1',
        'advanced': 'B2'
      };
      
      const mappedTestLevel = testLevelMapping[testLevel] || 'A1';
      const userIndex = cefrLevels.indexOf(userLevel);
      const testIndex = cefrLevels.indexOf(mappedTestLevel);
      
      return userIndex >= testIndex;
    } else {
      // Eski format için fallback
      const userIndex = oldLevels.indexOf(userLevel);
      const testIndex = oldLevels.indexOf(testLevel);
      return userIndex >= testIndex;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Testler</h1>
          <p className="text-gray-600 text-lg">
            Seviyenize uygun testleri çözerek İngilizce becerilerinizi geliştirin
          </p>
          
          {/* Kullanıcı seviyesi */}
          <div className="mt-6 inline-block">
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getLevelColor(userLevel)}`}>
              Seviye: {getLevelText(userLevel)}
            </span>
          </div>
          
                     {/* Seviye güncelleme bilgisi */}
           {userLevel && userLevel !== 'C2' && (
             <div className="mt-4 max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
               <div className="flex items-center justify-center gap-3">
                 <div className="text-center flex-1">
                   <h4 className="font-semibold text-green-800">Seviye Yükseltme</h4>
                   <p className="text-green-700 text-sm">
                     Kendi seviyenizdeki testlerde %90 ve üzeri puan alarak seviyenizi yükseltebilirsiniz.
                   </p>
                   <p className="text-green-600 text-xs mt-1">
                     Sonraki seviye: {getLevelText(getNextLevel(userLevel))}
                   </p>
                 </div>
               </div>
             </div>
           )}
        </div>

        {/* Seviye bilinmiyorsa uyarı */}
        {!userLevel && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <span className="material-icons text-yellow-600 text-2xl">info</span>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Seviye Tespiti Gerekli</h3>
                <p className="text-yellow-700">
                  Testleri çözebilmek için önce seviye tespit sınavını tamamlayın.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filtreleme Bölümü */}
        
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Test Seviyeleri</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedFilter === 'all'
                  ? 'bg-gradient-to-r from-[#798ed9] to-[#90c3e0] text-white shadow-lg border border-[#6a7bc0]'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Tüm Testler
            </button>
            <button
              onClick={() => setSelectedFilter('level-detection')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedFilter === 'level-detection'
                  ? 'bg-gradient-to-r from-[#798ed9] to-[#90c3e0] text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Seviye Tespit
            </button>
            <button
              onClick={() => setSelectedFilter('beginner')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedFilter === 'beginner'
                  ? 'bg-gradient-to-r from-[#798ed9] to-[#90c3e0] text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Başlangıç
            </button>
            <button
              onClick={() => setSelectedFilter('intermediate')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedFilter === 'intermediate'
                  ? 'bg-gradient-to-r from-[#798ed9] to-[#90c3e0] text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Orta
            </button>
            <button
              onClick={() => setSelectedFilter('upper-intermediate')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedFilter === 'upper-intermediate'
                  ? 'bg-gradient-to-r from-[#798ed9] to-[#90c3e0] text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Orta-İleri
            </button>
            <button
              onClick={() => setSelectedFilter('advanced')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedFilter === 'advanced'
                  ? 'bg-gradient-to-r from-[#798ed9] to-[#90c3e0] text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              İleri
            </button>
          </div>
        </div>

        {/* Testler Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const isLocked = isTestLocked(test);
            return (
              <div 
                key={test.id}
                className={`bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full ${
                  isLocked ? 'opacity-60' : ''
                }`}
              >
                {/* Test Header */}
                                    <div className={`p-6 text-white ${
                      isLocked 
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500' 
                        : 'bg-gradient-to-r from-[#798ed9] to-[#90c3e0] '
                    }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{test.title}</h3>
                    <div className="flex items-center gap-2">
                      {isLocked && (
                        <span className="material-icons text-white text-xl">lock</span>
                      )}
                      <span className="material-icons text-2xl opacity-80">quiz</span>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm">{test.description}</p>
                </div>

                {/* Test Detayları */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="material-icons text-lg">schedule</span>
                      <span>Süre: {test.duration} dakika</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="material-icons text-lg">question_answer</span>
                      <span>Soru Sayısı: {test.questions.length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="material-icons text-lg">category</span>
                      <span>Kategori: {test.id.includes('grammar') ? 'Gramer' : 'Kelime'}</span>
                    </div>
                    {test.id !== 'level-detection' && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="material-icons text-lg">school</span>
                        <span>Seviye: {getTestLevelText(test.id)}</span>
                      </div>
                    )}
                    {isLocked && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <span className="material-icons text-lg">info</span>
                        <span>Bu test için {getTestLevelText(test.id)} gereklidir</span>
                      </div>
                    )}
                  </div>

                                    {/* Başlat Butonu */}
                  <button
                    onClick={() => !isLocked && handleStartTest(test)}
                    disabled={isLocked}
                                            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 mt-auto ${
                          isLocked
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#798ed9] to-[#90c3e0] text-white hover:from-[#6a7bc0] hover:to-[#a3d2ed] border '
                        }`}
                  >
                    {isLocked ? (
                      <>
                        <span className="material-icons">lock</span>
                        Kilitli
                      </>
                    ) : (
                      <>
                        <span className="material-icons">play_arrow</span>
                        Testi Başlat
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {/* İpuçları */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="material-icons text-blue-600">lightbulb</span>
            Test Çözme İpuçları
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="material-icons text-blue-500 text-lg">timer</span>
              <span>Süre sınırına dikkat edin ve soruları dikkatli okuyun</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-icons text-blue-500 text-lg">refresh</span>
              <span>Testleri tekrar çözerek bilgilerinizi pekiştirin</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-icons text-blue-500 text-lg">trending_up</span>
              <span>Düzenli test çözerek ilerlemenizi takip edin</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-icons text-blue-500 text-lg">school</span>
              <span>Yanlış cevaplarınızı öğrenme fırsatı olarak görün</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tests; 