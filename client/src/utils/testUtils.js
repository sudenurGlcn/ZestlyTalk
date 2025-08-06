// Skor hesaplama ve seviye açıklaması
export function calculateScoreAndLevel(answers, correctAnswers) {
  let score = 0;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i] === correctAnswers[i]) score++;
  }
  let level = "";
  let description = "";
  if (score <= 3) {
    level = "A1";
    description = "Temel seviyede İngilizce bilgisi. Basit gramer ve kelime bilgisi mevcut.";
  } else if (score <= 6) {
    level = "A2";
    description = "Orta seviye. Günlük konuşmalar anlaşılır ama ileri dil bilgisi eksik.";
  } else if (score <= 8) {
    level = "B1";
    description = "İyi seviyede. Farklı konularda konuşabilir, gramer hâkimiyeti yüksek.";
  } else {
    level = "B2";
    description = "İleri düzey. Akıcı ve doğru şekilde yazılı/sözlü iletişim kurabilir.";
  }
  return { score, level, description };
}
// Zamanı mm:ss formatına çevir
export function formatTime(seconds) {
  const min = Math.floor(seconds / 60).toString().padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
} 