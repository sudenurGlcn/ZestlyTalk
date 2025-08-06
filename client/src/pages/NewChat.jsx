import React, { useState, useRef, useEffect } from "react";
import RegisterBackground from "../assets/RegisterBackground.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, addMessage, clearMessages, startFreeTalkChat, sendFreeTalkMessage, setSelectedScenario, setChatId } from "../store/scenarioSlice";
import { selectUserInfo } from "../store/userSlice";
import InteractiveMessage from "../components/InteractiveMessage";
import Swal from 'sweetalert2';

export default function NewChat() {
  const [input, setInput] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFreeTalkMode, setIsFreeTalkMode] = useState(false);
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = userInfo.id;
  const user_id = userInfo.id;
  const messagesEndRef = useRef(null);

  // Redux state'lerini al
  const { 
    messages, 
    isLoading, 
    chatId
  } = useSelector((state) => state.scenario);

  // Otomatik scroll - yeni mesaj geldiğinde en alta scroll et
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Level kontrolü - kullanıcının seviyesi null ise uyarı göster
  useEffect(() => {
    if (userInfo && userInfo.level === null) {
      Swal.fire({
        icon: 'warning',
        title: 'Seviye Testi Gerekli',
        html: `
          <div class="text-center">
            <p class="mb-6">Senaryoları kullanabilmek için önce seviye testinizi çözmeniz gerekmektedir.</p>
            <div class="mt-8 mb-2">
              <button id="test-button" class="bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-all duration-200 shadow-md text-sm">
                ✍️ Seviye Testini Çöz
              </button>
            </div>
          </div>
        `,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Devam Et',
        cancelButtonColor: '#6b7280',
        allowOutsideClick: true,
        didOpen: () => {
          // Test butonuna tıklandığında
          document.getElementById('test-button').addEventListener('click', () => {
            Swal.close();
            navigate('/tests');
          });
        }
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          // Devam et butonuna basıldığında modal kapanır, sayfada kalır
        }
      });
    }
  }, [userInfo, navigate]);

  // Component mount olduğunda mesajları temizle ve bot ilk mesajını gönder
  useEffect(() => {
    // Mesajları temizle
    dispatch(clearMessages());
    
    // Bot'un ilk mesajını gönder
    const botMessage = {
      from: "bot",
      text: "Merhaba! Ben dil öğrenme sohbet botuyum. 🤖\n\nSize nasıl yardımcı olabilirim?\n\n• Hazır senaryolar üzerinden pratik yapmak isterseniz, aşağıdaki seçeneklerden birini seçebilirsiniz.\n• Kendi seçtiğiniz konu üzerinde serbest sohbet etmek isterseniz, 'Serbest Sohbet' seçeneğini seçebilirsiniz.",
      timestamp: new Date().toISOString()
    };
    dispatch(addMessage(botMessage));
  }, []);

  // Mesaj gönderme fonksiyonu - serbest sohbet ve senaryo modları için ayrı
  const handleSend = async () => {
    if (input.trim() && chatId && userId) {
      // Kullanıcı mesajını Redux'a ekle
      const userMessage = {
        from: "user",
        text: input,
        timestamp: new Date().toISOString()
      };
      dispatch(addMessage(userMessage));

      // Serbest sohbet modunda ise sendFreeTalkMessage, değilse sendMessage kullan
      if (isFreeTalkMode) {
        const messageData = {
          userMessage: input,
          userId: userId,
          chatId: chatId
        };
        await dispatch(sendFreeTalkMessage(messageData));
      } else {
        const result = await dispatch(sendMessage({
          userMessage: input,
          userId: userId,
          chatId: chatId
        }));

        // Eğer kullanıcı mesajında da analysis varsa, onu da güncelle
        if (result.payload && result.payload.userAnalysis) {
          // Son kullanıcı mesajını güncelle
          const updatedUserMessage = {
            ...userMessage,
            analysis: result.payload.userAnalysis
          };
          // Mesajı güncelle (son mesajı değiştir)
          dispatch(addMessage(updatedUserMessage));
        }
      }

      setInput("");
    }
  };

  // Senaryo seçeneklerini göster
  const handleShowScenarios = () => {
    setShowOptions(true);
    setSelectedOption('scenarios');
  };

  // Serbest sohbet seç
  const handleFreeChat = async () => {
    try {
      setIsFreeTalkMode(true);
      
      // Serbest sohbet için startFreeTalkChat action'ını çağır
      const result = await dispatch(startFreeTalkChat({ 
        user_id: user_id
      })).unwrap(); // unwrap ekleyelim
      
      if (result && result.chatId) {
        // chatId'yi Redux'a kaydet
        dispatch(setChatId(result.chatId));
        
        // Senaryo bilgilerini güncelle
        dispatch(setSelectedScenario({
          id: null,
          title: 'Serbest Sohbet',
          level: 'beginner',
          category: 'free-chat',
          description: 'Serbest sohbet',
          forceUpdate: true // Zorla güncelle
        }));
        // Not: İlk bot mesajı scenarioSlice'ta ekleniyor
      }
    } catch (error) {
      console.error('Serbest sohbet başlatma hatası:', error);
    }
  };

  // Senaryolar sayfasına yönlendir (kategori ile)
  const handleGoToScenarios = (category = null) => {
    // Kategori bilgisini URL parametresi olarak gönder
    let params = '?force-new=true';
    if (category) {
      params += `&category=${encodeURIComponent(category)}`;
    }
    navigate(`/scenarios${params}`);
  };

  // Seçenekleri gizle
  const handleHideOptions = () => {
    setShowOptions(false);
    setSelectedOption(null);
  };

  // Loading durumu
  if (isLoading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7e90d0] mx-auto mb-4"></div>
            <p className="text-gray-600">Sohbet başlatılıyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
      {/* Navbar */}
      <Navbar />

      {/* Ana içerik */}
      <div className="flex w-full max-w-7xl mx-auto mt-8 rounded-2xl overflow-hidden shadow-xl bg-white/80" style={{ height: 'calc(100vh - 150px)', minHeight: 700 }}>
        {/* Sol panel - Seçenekler */}
        <aside className="w-1/3 min-w-[220px] max-w-xs bg-white flex flex-col items-center justify-center p-8 border-r border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Yeni Sohbet
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Nasıl devam etmek istiyorsunuz?
          </p>
          
          {/* Hazır Senaryolar Butonu */}
          <button 
            className="w-full py-3 mb-4 rounded-xl bg-gradient-to-r from-[#e57697] to-[#f7b6d2] text-white font-semibold text-lg shadow-md transition-all duration-200 hover:scale-105"
            onClick={handleShowScenarios}
          >
            📚 Hazır Senaryolar
          </button>
          
          {/* Serbest Sohbet Butonu */}
          <button 
            className="w-full py-3 mb-4 rounded-xl bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] text-white font-semibold text-lg shadow-md transition-all duration-200 hover:scale-105"
            onClick={handleFreeChat}
          >
            💬 Serbest Sohbet
          </button>

          {/* Senaryo Seçenekleri Modal'ı */}
          {showOptions && selectedOption === 'scenarios' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#e57697] to-[#f7b6d2] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Hazır Senaryolar
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Hangi tür senaryo ile pratik yapmak istiyorsunuz?
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => handleGoToScenarios('Günlük & Sosyal Hayat')}
                    className="w-full py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold transition-all duration-200 hover:bg-gray-50 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">☕</span>
                      <div>
                        <div className="font-semibold">Günlük Yaşam</div>
                        <div className="text-xs text-gray-500">Kafe, restoran, alışveriş</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleGoToScenarios('İş & Kariyer')}
                    className="w-full py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold transition-all duration-200 hover:bg-gray-50 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">💼</span>
                      <div>
                        <div className="font-semibold">İş Hayatı</div>
                        <div className="text-xs text-gray-500">Toplantı, görüşme, e-posta</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleGoToScenarios('Seyahat & Alışveriş')}
                    className="w-full py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold transition-all duration-200 hover:bg-gray-50 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">✈️</span>
                      <div>
                        <div className="font-semibold">Seyahat</div>
                        <div className="text-xs text-gray-500">Otel, havaalanı, yol tarifi</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleGoToScenarios()}
                    className="w-full py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold transition-all duration-200 hover:bg-gray-50 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📚</span>
                      <div>
                        <div className="font-semibold">Tüm Kategoriler</div>
                        <div className="text-xs text-gray-500">Bütün senaryoları görüntüle</div>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleHideOptions}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold transition-all duration-200 hover:bg-gray-50"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
        
        {/* Chat alanı */}
        <main className="flex-1 flex flex-col bg-cover bg-center" style={{ backgroundImage: `url(${RegisterBackground})` }}>
          {/* Mesajlar alanı - Scroll edilebilir */}
          <div className="flex-1 flex flex-col px-8 py-6 gap-3 overflow-y-auto min-h-0">
            <div className="flex-1 flex flex-col gap-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`px-5 py-2 rounded-2xl shadow text-base font-medium max-w-xs break-words ${
                    msg.from === "user" 
                      ? "bg-white text-gray-800" 
                      : "bg-white/80 text-gray-700"
                  }`}>
                    {msg.from === "user" ? (
                      msg.analysis ? (
                        <InteractiveMessage message={msg} isUserMessage={true} />
                      ) : (
                        msg.text
                      )
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-5 py-2 rounded-2xl shadow text-base font-medium bg-white/80 text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#7e90d0]"></div>
                      <span>Yazıyor...</span>
                    </div>
                  </div>
                </div>
              )}
              {/* Scroll referansı - otomatik scroll için */}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Mesaj kutusu - Sabit alt kısım */}
          <div className="flex-shrink-0 bg-white/80 border-t border-gray-200">
            <form className="flex items-center gap-4 px-8 py-6" onSubmit={e => { e.preventDefault(); handleSend(); }}>
              <input
                type="text"
                className="flex-1 px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b4e3fd] bg-white placeholder-gray-400 text-base"
                placeholder="Mesajınızı Yazınız"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#e57697] to-[#f7b6d2] text-white font-semibold text-lg shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50"
                disabled={isLoading || !input.trim()}
              >
                Gönder
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
} 