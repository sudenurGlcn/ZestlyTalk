import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import RegisterBackground from "../assets/RegisterBackground.png";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { startScenario, sendMessage, addMessage, clearMessages, getHints, setSelectedScenario, setChatId } from "../store/scenarioSlice";
import { getChatMessages, clearChatMessages } from "../store/chatHistorySlice";
import scenariosService from "../services/scenariosService.js";
import ScenarioCompletionModal from "../components/ScenarioCompletionModal";
import StopChatModal from "../components/StopChatModal";
import ConversationAnalysisModal from "../components/ConversationAnalysisModal";
import {selectUserInfo} from "../store/userSlice.js";
import InteractiveMessage from "../components/InteractiveMessage";
import Swal from 'sweetalert2';

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [completionStatus, setCompletionStatus] = useState(null);
  const [isStopChatModalOpen, setIsStopChatModalOpen] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const { user } = useAuth();

  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const { scenarioId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const userId = userInfo.id;
  const messagesEndRef = useRef(null);
  const hasStartedScenario = useRef(false); // Senaryo başlatılıp başlatılmadığını takip et
  
  // URL'den chatId'yi al
  const searchParams = new URLSearchParams(location.search);
  const chatIdFromUrl = searchParams.get('chatId');
  
  // Redux state'lerini al
  const { 
    selectedScenario, 
    messages, 
    isLoading, 
    error, 
    scenarioData,
    chatId,
    hints
  } = useSelector((state) => state.scenario);


  const { 
    chatMessages,
    chatMessagesLoading,
    chatMessagesError
  } = useSelector((state) => state.chatHistory);

  // LocalStorage'dan tamamlanan senaryoları kontrol et
  const getCompletedScenariosFromStorage = () => {
    try {
      const scenarioState = localStorage.getItem('scenarioState');
      if (scenarioState) {
        const parsed = JSON.parse(scenarioState);
        return parsed.userCompletedScenarios || [];
      }
    } catch (error) {
 
    }
    return [];
  };

  const completedScenarios = getCompletedScenariosFromStorage();
  
  // Mevcut chat'in tamamlanıp tamamlanmadığını kontrol et
  const isCurrentChatCompleted = chatIdFromUrl ? 
    completedScenarios.some(chat => 
      chat.id == chatIdFromUrl && chat.status === 'completed'
    ) : false;


  // Otomatik scroll - yeni mesaj geldiğinde en alta scroll et
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMessages]);

  // API'den gelen mesajları formatla
  const formatChatMessages = (messages) => {
    if (!messages || !Array.isArray(messages)) return [];
    
    return messages.map(msg => {
      // Mesaj içeriğini string olarak al
      let text = '';
      
      try {
        if (msg && typeof msg === 'object') {
          if (msg.content) {
            if (typeof msg.content === 'string') {
              text = msg.content;
            } else if (typeof msg.content === 'object') {
              text = msg.content.message || msg.content.content || '';
            }
          } else if (msg.message) {
            if (typeof msg.message === 'string') {
              text = msg.message;
            } else if (typeof msg.message === 'object') {
              text = msg.message.content || msg.message.message || '';
            }
          }
        }
        
        // Son kontrol - eğer hala obje ise JSON string'e çevir
        if (typeof text === 'object') {
          text = JSON.stringify(text);
        }
        
        // Eğer text hala boşsa veya undefined ise
        if (!text || text === 'undefined' || text === 'null') {
          text = '';
        }
      } catch (error) {
        text = '';
      }
      
      return {
        from: msg && msg.sender === 'user' ? 'user' : 'bot',
        text: text,
        timestamp: msg && (msg.created_at || msg.timestamp) ? (msg.created_at || msg.timestamp) : new Date().toISOString()
      };
    });
  };

  // Görüntülenecek mesajları belirle - sadece Redux'taki mesajları kullan
  const displayMessages = messages && Array.isArray(messages) ? messages : [];

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

  // Component mount olduğunda senaryo başlat veya mevcut sohbeti yükle
  useEffect(() => {
    // Farklı bir senaryo seçildiyse mesajları temizle
    if (scenarioData?.id && scenarioData.id !== parseInt(scenarioId)) {
      dispatch(clearMessages());
    }
    
    if (scenarioId && userInfo?.id && !hasStartedScenario.current) {
      hasStartedScenario.current = true; // Senaryo başlatıldığını işaretle
      
      // Eğer URL'de chatId varsa, mevcut sohbeti yükle
      if (chatIdFromUrl) {
        // Önce mevcut mesajları temizle
        dispatch(clearMessages());
        dispatch(clearChatMessages());
        
        // Redux state'indeki chatId'yi güncelle
        dispatch(setChatId(parseInt(chatIdFromUrl)));
        
        // ChatHistory'den mesajları yükle
        dispatch(getChatMessages({ chatId: parseInt(chatIdFromUrl) }))
          .then((result) => {
            if (result.payload && Array.isArray(result.payload) && result.payload.length > 0) {
              // ChatHistory'den yüklenen mesajları Redux'a aktar
              const formattedMessages = formatChatMessages(result.payload);
              formattedMessages.forEach(msg => {
                dispatch(addMessage(msg));
              });
            }
          });
        
        // Mevcut sohbet için scenario bilgilerini al
        if (!selectedScenario?.id) {
          scenariosService.getScenarioById(scenarioId)
            .then(scenarioData => {
           
              // Senaryo bilgilerini Redux'a kaydet
              dispatch(setSelectedScenario({
                id: scenarioData.id,
                title: scenarioData.title,
                level: scenarioData.difficulty_level,
                category: scenarioData.category,
                description: scenarioData.scenario_info,
                milestones: scenarioData.milestones_tr
              }));
            })
            .catch(error => {
              console.error('Scenario bilgileri alınamadı:', error);
            });
        }
      } else {
        // Yeni senaryo başlat
        dispatch(startScenario({ 
          scenarioId: parseInt(scenarioId), 
          userId: userInfo.id, 
          level: selectedScenario?.level || 'beginner'
        }));
      }
    }
  }, [scenarioId, userInfo?.id, chatIdFromUrl, dispatch, selectedScenario?.id]); // isLoading'i kaldırdım


  // Mesaj gönderme fonksiyonu
  const handleSend = async () => {
    const currentChatId = chatIdFromUrl || chatId;
    if (input.trim() && currentChatId && userId) {
      // Kullanıcı mesajını Redux'a ekle
      const userMessage = {
        from: "user",
        text: input,
        timestamp: new Date().toISOString()
      };
      dispatch(addMessage(userMessage));

      // Backend'e mesaj gönder
      const result = await dispatch(sendMessage({
        userMessage: input,
        userId: userId,
        chatId: currentChatId // Mevcut chatId'yi kullan
      }));
      setInput("");
    }
  };

  // Sohbeti durdur modal'ını aç
  const handleStopChat = () => {
    setIsStopChatModalOpen(true);
  };

  // Sohbeti durdur onayı
  const handleConfirmStopChat = async () => {
    const currentChatId = chatIdFromUrl || chatId;
    
    if (currentChatId && userId) {
      try {
        setModalLoading(true);
        
        // Yeni analiz sistemi ile sohbeti sonlandır
        const response = await fetch('http://localhost:5000/api/coordinator/end-conversation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authState') ? JSON.parse(localStorage.getItem('authState')).accessToken : ''}`
          },
          body: JSON.stringify({
            userId: userId,
            chatId: currentChatId
          })
        });

        if (response.ok) {
          const analysisData = await response.json();
        
          setIsStopChatModalOpen(false);
          
          // Analiz modalını aç
          setAnalysisData(analysisData);
          setIsAnalysisModalOpen(true);
        } else {
          throw new Error('Sohbet analizi yapılamadı');
        }
      } catch (error) {
        console.error('Sohbet analizi hatası:', error);
        // Hata durumunda da analiz sayfasına git (boş veri ile)
        navigate("/chat-analysis");
      } finally {
        setModalLoading(false);
      }
    }
  };

  // Sohbeti durdur iptali
  const handleCancelStopChat = () => {
    setIsStopChatModalOpen(false);
  };

  // Analiz modalını kapat
  const handleCloseAnalysisModal = () => {
    setIsAnalysisModalOpen(false);
    setAnalysisData(null);
  };
  

  // Senaryo tamamla
  const handleCompleteScenario = () => {
    setIsModalOpen(true);
    setCompletionStatus(null);
  };

  // Modal'ı kapat
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalLoading(false);
    setCompletionStatus(null);
  };

  // Senaryo tamamlama onayı
  const handleConfirmCompletion = async () => {
    setModalLoading(true);
    
    try {
      // Backend'e senaryo tamamlama isteği gönder
      const response = await fetch(`/api/scenarios/${scenarioId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authState') ? JSON.parse(localStorage.getItem('authState')).accessToken : ''}`
        },
        body: JSON.stringify({
          userId: user?.id,
          scenarioId: parseInt(scenarioId),
          messages: messages // Sohbet mesajlarını gönder
        })
      });

      const data = await response.json();
      
      if (response.ok && data.completed) {
        setCompletionStatus('success');
        // Başarılı tamamlama durumunda ek işlemler
        
      } else {
        setCompletionStatus('failed');
       
      }
    } catch (error) {
      
      setCompletionStatus('failed');
    } finally {
      setModalLoading(false);
    }
  };

  // Sohbete devam et
  const handleContinueChat = () => {
    setIsModalOpen(false);
    setCompletionStatus(null);
    // Modal kapatıldıktan sonra sohbete devam et
  };

  // İpucu seç
  const handleHintSelect = (hint) => {
    setInput(hint);
    setShowHints(false);
  };

  // İpucu iste
  const handleRequestHint = async () => {
    const currentChatId = chatIdFromUrl || chatId;
    
    if (currentChatId) {
      try {
        await dispatch(getHints(currentChatId));
        setShowHints(true);
      } catch (error) {
        // console.error('İpucu alma hatası:', error);
      }
    }
  };

  // Yeni sohbet başlat
  const handleNewChat = async () => {
    // Eğer selectedScenario.id yoksa, URL'den gelen scenarioId'yi kullan
    const currentScenarioId = selectedScenario?.id || scenarioId;
    
    if (!userInfo?.id || !currentScenarioId) {
      console.error('Gerekli bilgiler eksik:', { userId: userInfo?.id, scenarioId: currentScenarioId });
      return;
    }

    try {
      // Yeni sohbet oluştur
      const response = await fetch('http://localhost:5000/api/chats/force-new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authState') ? JSON.parse(localStorage.getItem('authState')).accessToken : ''}`
        },
        body: JSON.stringify({
          userId: userInfo.id,
          scenarioId: parseInt(currentScenarioId)
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Mesajları temizle
        dispatch(clearMessages());
        dispatch(clearChatMessages());
        
        // URL'yi temizle ve yeni sohbet başlat
        navigate(`/chatbot/${currentScenarioId}`, { replace: true });
        window.location.reload();
      } else {
        const errorData = await response.text();
        console.error('Yeni sohbet oluşturulamadı:', errorData);
      }
    } catch (error) {
      console.error('Yeni sohbet hatası:', error);
    }
  };

  // Loading durumu - sadece ilk yükleme sırasında
  if (isLoading && messages.length === 0 && !chatId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7e90d0] mx-auto mb-4"></div>
            <p className="text-gray-600">Senaryo yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error durumu
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              {typeof error === 'string' ? error : error?.message || 'Bir hata oluştu'}
            </p>
            <button 
              onClick={() => navigate("/scenarios")}
              className="px-6 py-2 bg-[#7e90d0] text-white rounded-lg"
            >
              Senaryolar Sayfasına Dön
            </button>
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
        {/* Sol panel */}
        <aside className="w-1/3 min-w-[220px] max-w-xs bg-white flex flex-col border-r border-gray-100">
          {/* Scroll edilebilir içerik alanı */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            {selectedScenario?.title || "Senaryo Yükleniyor..."}
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Seviye: {selectedScenario?.level}
          </p>
          
          {/* Sohbet Tamamlandı Uyarısı */}
          {isCurrentChatCompleted && (
            <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-800 text-center">
                ✅ Bu sohbet tamamlanmış. Sadece görüntüleme modunda çalışıyor. Yeni bir sohbet başlatmak için "Yeni Sohbet" butonunu kullanın.
              </p>
            </div>
          )}
           
           {/* Yeni Sohbet Butonu */}
           <button 
             className="w-full py-2 mb-3 rounded-xl bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] text-white font-semibold text-base shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
             onClick={handleNewChat}
             disabled={isLoading}
           >
             🆕 Yeni Sohbet
           </button>

           {/* Senaryo Bilgileri */}
           {scenarioData?.description && (
             <>
               {/* Senaryo Açıklaması */}
               <div className="w-full mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                 <h4 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-1">
                   <span>📖</span>
                   Senaryo Hakkında
                 </h4>
                 <p className="text-[0.80rem] text-purple-800 leading-relaxed">
                   {scenarioData.description || "Senaryo bilgisi bulunmuyor."}
                 </p>
               </div>

               {/* Senaryo Görevleri */}
               <div className="w-full mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                 <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-1">
                   <span>🎯</span>
                   Görevler
                 </h4>
                 <div className="space-y-2">
                   {scenarioData.milestones && scenarioData.milestones.points ? (
                     scenarioData.milestones.points.map((milestone, index) => (
                       <div key={index} className="flex items-start gap-2">
                         <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                           <span className="text-white text-[0.8rem] font-bold">{index + 1}</span>
                         </div>
                         <p className="text-[0.8rem] text-green-700 leading-relaxed">
                           {typeof milestone === 'string' ? milestone : milestone.description || milestone.key || 'Görev açıklaması bulunmuyor'}
                         </p>
                       </div>
                     ))
                   ) : (
                     <p className="text-xs text-green-600">Görev listesi bulunmuyor.</p>
                   )}
                 </div>
               </div>
             </>
           )}

                     {/* İpucu İste Butonu */}
           <button 
             className="w-full py-2 mb-3 rounded-xl bg-gradient-to-r from-[#e57697] to-[#f7b6d2] text-white font-semibold text-base shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
             onClick={handleRequestHint}
             disabled={isLoading || isCurrentChatCompleted}
           >
             💡 İpucu İste
           </button>

                       {/* İpucu Önerileri */}
            {hints && hints.hints && hints.hints.length > 0 && showHints && (
              <div className="w-full mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-1">
                  <span>💡</span>
                  İpucu Önerileri
                </h4>
                <div className="space-y-2">
                  {hints.hints.map((hint, index) => (
                    <div
                      className="w-full text-left p-2 text-xs bg-white border border-yellow-300 rounded text-yellow-700"
                    >
                      {typeof hint === 'string' ? hint : (
                        <div>
                          <div className="font-medium">{hint.english || 'İngilizce ipucu'}</div>
                          {hint.turkish && (
                            <div className="text-xs text-gray-500 mt-1">{hint.turkish}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          
          {/* Sohbeti Bitir Butonu */}
          <button 
            className="w-full py-2 mb-3 rounded-xl bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] text-white font-semibold text-base shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleStopChat}
            disabled={isCurrentChatCompleted}
          >
            📊 Sohbeti Durdur
          </button>

          {/* Senaryo İlerleme Durumu */}
          <div className={`w-full mt-4 p-3 border rounded-lg ${
            isCurrentChatCompleted 
              ? 'bg-green-50 border-green-200' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <p className={`text-xs text-center ${
              isCurrentChatCompleted ? 'text-green-800' : 'text-blue-800'
            }`}>
              <strong>Sohbet Durumu:</strong> {isCurrentChatCompleted ? '✅ Tamamlandı' : '🔄 Devam Ediyor'}
             </p>
           </div>
            </div>
          </div>
        </aside>
        
        {/* Chat alanı */}
        <main className="flex-1 flex flex-col bg-cover bg-center" style={{ backgroundImage: `url(${RegisterBackground})` }}>
          {/* Mesajlar alanı - Scroll edilebilir */}
          <div className="flex-1 flex flex-col px-8 py-6 gap-3 overflow-y-auto min-h-0">
            <div className="flex-1 flex flex-col gap-3">
              {chatMessagesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7e90d0] mx-auto mb-2"></div>
                    <p className="text-gray-600 text-sm">Mesajlar yükleniyor...</p>
                  </div>
                </div>
              ) : chatMessagesError ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <p className="text-red-600 text-sm mb-2">Hata: {chatMessagesError}</p>
                    <button 
                      onClick={() => dispatch(getChatMessages({ chatId: parseInt(chatIdFromUrl) }))}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                    >
                      Tekrar Dene
                    </button>
                  </div>
                </div>
              ) : (
                (displayMessages || []).map((msg, idx) => {
                  return (
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
                  );
                })
              )}
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
                className="flex-1 px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b4e3fd] bg-white placeholder-gray-400 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={isCurrentChatCompleted ? "Bu sohbet tamamlandı - sadece görüntüleme modu" : "Mesajınızı Yazınız"}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isLoading || isCurrentChatCompleted}
              />
              <button 
                type="submit" 
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#e57697] to-[#f7b6d2] text-white font-semibold text-lg shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !input.trim() || isCurrentChatCompleted}
                onClick={handleSend}
              >
                Gönder
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* Senaryo Tamamlama Modal'ı */}
      <ScenarioCompletionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCompletion}
        onContinue={handleContinueChat}
        isLoading={modalLoading}
        completionStatus={completionStatus}
      />

      {/* Sohbeti Durdurma Modal'ı */}
      <StopChatModal
        isOpen={isStopChatModalOpen}
        onClose={handleCancelStopChat}
        onConfirm={handleConfirmStopChat}
        onCancel={handleCancelStopChat}
        isLoading={modalLoading}
      />

      {/* Sohbet Analizi Modal'ı */}
      <ConversationAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={handleCloseAnalysisModal}
        analysisData={analysisData}
      />
    </div>
  );
} 