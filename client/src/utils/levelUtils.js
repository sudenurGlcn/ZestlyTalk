// CEFR seviye sıralaması (düşükten yükseğe)
const LEVEL_ORDER = {
  'A1': 1,
  'A2': 2,
  'B1': 3,
  'B2': 4,
  'C1': 5,
  'C2': 6,
  // Eski seviyeler için uyumluluk
  'beginner': 1,
  'elementary': 2,
  'intermediate': 3,
  'upper-intermediate': 4,
  'advanced': 5
};

// Kullanıcının seviyesini sayısal değere çevir
export const getLevelValue = (level) => {
  const levelValue = LEVEL_ORDER[level?.toUpperCase()] || 0;
  return levelValue;
};

// Kullanıcının bir senaryoya erişim yetkisi var mı kontrol et
export const canAccessScenario = (userLevel, scenarioLevel) => {
  const userLevelValue = getLevelValue(userLevel);
  const scenarioLevelValue = getLevelValue(scenarioLevel);
  const canAccess = userLevelValue >= scenarioLevelValue;
  return canAccess;
};

// Seviye adını Türkçe'ye çevir
export const getLevelDisplayName = (level) => {
  const levelMap = {
    'A1': 'A1 - Başlangıç',
    'A2': 'A2 - Temel',
    'B1': 'B1 - Orta',
    'B2': 'B2 - İleri Orta',
    'C1': 'C1 - İleri',
    'C2': 'C2 - Uzman',
    // Eski seviyeler için uyumluluk
    'beginner': 'Başlangıç',
    'elementary': 'Temel',
    'intermediate': 'Orta',
    'upper-intermediate': 'İleri Orta',
    'advanced': 'İleri'
  };
  
  return levelMap[level?.toUpperCase()] || level;
};

// Bir üst seviyeyi getir
export const getNextLevel = (currentLevel) => {
  const levelProgression = {
    'A1': 'A2',
    'A2': 'B1',
    'B1': 'B2',
    'B2': 'C1',
    'C1': 'C2',
    'C2': 'C2' // En üst seviye
  };
  const normalizedLevel = currentLevel?.toUpperCase();
  const nextLevel = levelProgression[normalizedLevel] || currentLevel;
  return nextLevel;
};

// Seviye güncelleme kontrolü (90+ skor için)
export const shouldUpdateLevel = (score, currentLevel) => {
  // score parametresi yüzde olarak gelmeli (0-100 arası)
  // Eğer ham skor geliyorsa, yüzdeye çevrilmesi gerekir
  const scorePercentage = typeof score === 'number' ? score : 0;
  // 90 ve üzeri skor için seviye güncelleme
  if (scorePercentage >= 90) {
    const nextLevel = getNextLevel(currentLevel);
    // Eğer bir üst seviye varsa güncelleme yapılabilir
    return nextLevel !== currentLevel;
  }
  return false;
};

// Seviye güncelleme mesajı oluştur
export const getLevelUpdateMessage = (currentLevel, newLevel, score) => {
  if (currentLevel === newLevel) {
    return {
      type: 'info',
      title: 'Mükemmel Performans!',
      message: `${score} puan aldınız! Seviyeniz zaten en üst düzeyde.`,
      showUpdate: false
    };
  }
  
  return {
    type: 'success',
    title: 'Seviye Yükseltildi!',
    message: `${score} puan aldınız! Seviyeniz ${currentLevel} seviyesinden ${newLevel} seviyesine yükseltildi.`,
    showUpdate: true
  };
}; 