import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TestTimer from "../components/Test/TestTimer";
import QuestionProgress from "../components/Test/QuestionProgress";
import QuestionCard from "../components/Test/QuestionCard";
import { calculateScoreAndLevel } from "../utils/testUtils";
import Swal from "sweetalert2";
import userService from "../services/userService.js";
import RegisterBackground from "../assets/RegisterBackground.png";
import { useDispatch, useSelector } from "react-redux";
import { setLevel } from "../store/userSlice";
import { selectUserInfo } from "../store/userSlice";
import { updateUser } from "../store/authSlice";
import Navbar from "../components/Navbar/Navbar";
import { shouldUpdateLevel, getNextLevel, getLevelUpdateMessage } from "../utils/levelUtils";

function TestResult({ answers, testData, isLevelDetection }) {
  let score, level, description;
  
  if (isLevelDetection) {
    // Seviye tespit testi için özel hesaplama
    const result = calculateScoreAndLevel(answers, testData.correctAnswers);
    score = result.score;
    level = result.level;
    description = result.description;
  } else {
    // Normal test için basit hesaplama
    let correctAnswers = 0;
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] === testData.questions[i].correctAnswer) correctAnswers++;
    }
    // Skoru yüzde olarak hesapla (0-100 arası)
    score = Math.round((correctAnswers / testData.questions.length) * 100);
    level = null;
    description = `Test tamamlandı! ${correctAnswers}/${testData.questions.length} soruya doğru cevap verdiniz.`;
  }
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  const userId = userInfo?.id;
  const levelUpdateRef = useRef(false);
  
  useEffect(() => {
    if (isLevelDetection && level && userId) {
      // Test sonucunu backend'e gönder
      const testResult = {
        score: score,
        totalQuestions: testData.questions.length,
        level: level,
        answers: answers,
        correctAnswers: testData.correctAnswers
      };
      
      // Backend'e seviye güncelleme isteği gönder
      userService.setLevelFromTest(userId, testResult)
        .then((response) => {
          // Her iki Redux store'u da güncelle
          dispatch(setLevel(level)); // userSlice
          dispatch(updateUser({ level: level })); // authSlice
          
          // Başarı mesajı göster
          Swal.fire({
            icon: 'success',
            title: 'Seviye Güncellendi!',
            text: `Seviyeniz başarıyla ${level} olarak güncellendi.`,
            confirmButtonText: 'Tamam'
          });
        })
        .catch((error) => {
          console.error('Seviye güncelleme hatası:', error);
          
          // Hata mesajı göster
          Swal.fire({
            icon: 'error',
            title: 'Hata!',
            text: 'Seviye güncellenirken bir hata oluştu. Lütfen tekrar deneyin.',
            confirmButtonText: 'Tamam'
          });
        });
    }
  }, [level, dispatch, isLevelDetection, userId, score, testData, answers]);

  // Normal test sonuçları için seviye güncelleme kontrolü
  useEffect(() => {

    
    if (!isLevelDetection && score >= 90 && userId && userInfo?.level && !levelUpdateRef.current) {
      const currentLevel = userInfo.level;
      const shouldUpdate = shouldUpdateLevel(score, currentLevel);
      const nextLevel = getNextLevel(currentLevel);

      // Seviye güncelleme işlemini sadece bir kez çalıştır
      if (shouldUpdate) {
        levelUpdateRef.current = true;
        
        const newLevel = getNextLevel(currentLevel);
        const updateMessage = getLevelUpdateMessage(currentLevel, newLevel, score);
     
        // Seviye güncelleme isteği gönder
        userService.updateLevelFromTestScore(userId, score, newLevel)
          .then((response) => {
          
            // Redux store'ları güncelle
            dispatch(setLevel(newLevel)); // userSlice
            dispatch(updateUser({ level: newLevel })); // authSlice
            
            // Başarı mesajı göster
            Swal.fire({
              icon: updateMessage.type,
              title: updateMessage.title,
              text: updateMessage.message,
              confirmButtonText: 'Tamam'
            });
            
            // Flag'i sıfırla
            levelUpdateRef.current = false;
          })
          .catch((error) => {
            console.error('Seviye güncelleme hatası:', error);
            
            // Hata mesajı göster
            Swal.fire({
              icon: 'error',
              title: 'Hata!',
              text: 'Seviye güncellenirken bir hata oluştu. Lütfen tekrar deneyin.',
              confirmButtonText: 'Tamam'
            });
            
            // Flag'i sıfırla
            levelUpdateRef.current = false;
          });
      } else if (score >= 90) {
        // 90+ skor ama seviye güncellenmedi (zaten en üst seviye)
        const updateMessage = getLevelUpdateMessage(currentLevel, currentLevel, score);
        
        Swal.fire({
          icon: updateMessage.type,
          title: updateMessage.title,
          text: updateMessage.message,
          confirmButtonText: 'Tamam'
        });
      }
    }
  }, [score, dispatch, isLevelDetection, userId, userInfo?.level]);
  
  return (
    <div className="min-h-screen flex flex-col" style={{
      backgroundImage: `url(${RegisterBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Header Bar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-2xl border border-white/30 p-8 flex flex-col items-center gap-8">
          {/* Tebrikler Başlığı */}
          <h2 className="text-4xl font-bold text-gray-800">Tebrikler!</h2>
          
          {/* Seviye Dairesi - Sadece seviye tespit testi için */}
          {isLevelDetection && level && (
            <div className="w-32 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">{level}</span>
            </div>
          )}
          
          {/* İstatistikler */}
          <div className="flex flex-col gap-4 w-full max-w-md">
            <div className="flex items-center gap-3 text-lg">
              <span className="material-icons text-gray-500">school</span>
              <span className="text-gray-700">Doğru Sayısı: <span className="font-bold">{score}/{testData.questions.length}</span></span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <span className="material-icons text-gray-500">school</span>
              <span className="text-gray-700">Başarı: <span className="font-bold text-black">{Math.round((score / testData.questions.length) * 100)}%</span></span>
            </div>
          </div>
          
          {/* Açıklama */}
          <p className="text-center text-gray-600 max-w-lg">{description}</p>
          
          {/* Seviye Güncelleme Bilgisi - Normal testler için */}
          {!isLevelDetection && score >= 90 && userInfo?.level && (
            <div className="w-full max-w-md bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="material-icons text-green-600 text-xl">trending_up</span>
                <div>
                  <h4 className="font-semibold text-green-800">Mükemmel Performans!</h4>
                  <p className="text-green-700 text-sm">
                    %90 ve üzeri puan aldınız. Seviyeniz otomatik olarak kontrol ediliyor...
                  </p>
                  {shouldUpdateLevel(score, userInfo.level) && (
                    <p className="text-green-600 text-xs mt-1">
                      Seviyeniz {userInfo.level} seviyesinden {getNextLevel(userInfo.level)} seviyesine yükseltildi!
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Başla Butonu */}
          <div className="flex gap-4 w-full max-w-md">
            <button 
              onClick={() => navigate('/tests')}
              className="flex-1 px-6 py-4 bg-[#7e90d0] text-white rounded-xl font-bold text-lg hover:bg-[#6a7bc0] transition shadow-lg"
            >
              Testlere Dön
            </button>
            {isLevelDetection && level && (
              <button 
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-4 bg-rose-500 text-white rounded-xl font-bold text-lg hover:bg-rose-400 transition shadow-lg"
              >
                Ana Sayfaya Git
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Test() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Test verilerini location state'den al
  const testData = location.state?.testData;
  const isLevelDetection = location.state?.isLevelDetection || false;
  
  // Test verisi yoksa testler sayfasına yönlendir
  if (!testData) {
    navigate('/tests');
    return null;
  }
  
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(testData.questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(testData.duration * 60); // Dakikayı saniyeye çevir
  const [finished, setFinished] = useState(false);

  function handleAnswer(idx) {
    setAnswers(prev => {
      const copy = [...prev];
      copy[current] = idx;

      return copy;
    });
  }

  function handleFinish() {
    Swal.fire({
      title: "Testi bitirmek istediğinize emin misiniz?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Testi Bitir",
      cancelButtonText: "İptal",
      customClass: {
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn"
      },
      buttonsStyling: false 
    }).then((result)  => {
      if (result.isConfirmed) {
        setFinished(true);
      }
    });
  }
  // Süre bittiğinde otomatik bitir (ileride timer ile entegre edilebilir)
  useEffect(() => {
     if (timeLeft === 0){
      setFinished(true);
      Swal.close();
     } 
     
    }, [timeLeft]);
  
  useEffect(() => {
    if (finished) return; // Test bitince timer dursun
    if (timeLeft === 0) return; // Süre bittiyse tekrar başlatma
  
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
  
    return () => clearInterval(interval); 
  }, [timeLeft, finished]);

  if (finished) {
    return (
      <TestResult answers={answers} testData={testData} isLevelDetection={isLevelDetection} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{
      backgroundImage: `url(${RegisterBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Navbar */}
      <Navbar />
      
      {/* Ana içerik */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-2xl border border-white/30 p-8 flex flex-col gap-8">
          {/* Üst bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{testData.title}</h1>
              <p className="text-gray-600 mt-1">{testData.description}</p>
            </div>
            <div className="flex items-center gap-4">
              {/* <div className="relative">
                <span className="material-icons text-3xl text-gray-400">menu</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
              </div> */}
            </div>
          </div>
          {/* Süre ve soru numaraları */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-[#2563eb]">
              
              <TestTimer timeLeft={timeLeft} />
            </div>
            <QuestionProgress questions={testData.questions} answers={answers} current={current} onJumpToQuestion={setCurrent} />
          </div>
          {/* Soru ve seçenekler */}
          <div className="mb-6">
            <QuestionCard question={testData.questions[current]} answer={answers[current]} onAnswer={handleAnswer} />
          </div>
          {/* Navigasyon butonları */}
          <div className="flex justify-between items-center mt-4 gap-4">
            <button
              className="px-6 py-2 rounded-lg bg-custom2 text-white font-semibold hover:bg-[#3b82f6] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              Önceki Soru
            </button>
            {current === testData.questions.length - 1 ? (
              <button
                className="px-6 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-400 transition"
                onClick={handleFinish}
              >
                Bitir
              </button>
            ) : (
              <button
                className="px-6 py-2 rounded-lg bg-custom2 text-white font-semibold hover:bg-[#3b82f6] transition disabled:opacity-50"
                onClick={() => setCurrent((c) => Math.min(testData.questions.length - 1, c + 1))}
                disabled={current === testData.questions.length - 1}
              >
                Sonraki Soru
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 