
import React, { useState, useRef, useEffect } from "react";
import RegisterBackground from "../assets/RegisterBackground.png";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { clearMessages } from "../store/scenarioSlice";
import { selectUserInfo } from "../store/userSlice";
import { getChatHistory } from "../store/chatHistorySlice";
import {  getChatMessages, clearChatMessages } from "../store/chatHistorySlice";

export default function ChatHistory() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userId = userInfo.id;
  const messagesEndRef = useRef(null);
  
  // URL'den scenarioId'yi al
  const searchParams = new URLSearchParams(location.search);
  const scenarioIdFromUrl = searchParams.get('scenarioId');

  // Redux state'lerini al
  const { 
    messages, 
    chatHistory,
    chatMessages,
    chatMessagesLoading,
    chatMessagesError
  } = useSelector((state) => state.chatHistory);

  // Otomatik scroll - yeni mesaj geldiğinde en alta scroll et
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (userInfo?.id) {
      dispatch(getChatHistory({ userId: userInfo.id }));
    }
  
  }, [userInfo?.id, dispatch]);

  // ChatHistoryData'yı scenarioId'ye göre filtrele
  const chatHistoryData = chatHistory && Array.isArray(chatHistory) 
    ? (scenarioIdFromUrl 
        ? chatHistory.filter(chat => chat.scenario?.id == scenarioIdFromUrl)
        : chatHistory)
    : [];
  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ChatMessages değiştiğinde konsola yazdır
  useEffect(() => {    
    if (chatMessages && chatMessages.length > 0) {
      // Her mesajı detaylı incele
      chatMessages.forEach((msg, index) => {
        
      });
    } else if (chatMessages && chatMessages.length === 0) {
     
    }
  }, [chatMessages, chatMessagesLoading, chatMessagesError, selectedChat?.id]);

  
  const handleViewChat = async (chat) => {
    setSelectedChat(chat);
    setShowChat(true);

    
    // Önceki mesajları temizle
    dispatch(clearMessages());
    dispatch(clearChatMessages());
    
    try {
      // Sohbet mesajlarını API'den al
   
      dispatch(getChatMessages({ chatId: chat.id }));
      
    } catch (error) {
      console.error('Sohbet mesajları alınamadı:', error);
    }
  };

  // Sohbeti kapat
  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedChat(null);
    dispatch(clearMessages());
  };

  // Tarih formatını düzenle
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sohbet tipine göre ikon
  const getChatIcon = (type, category) => {
    if (type === 'free-chat') return '💬';
    switch (category) {
      case 'daily': return '☕';
      case 'business': return '💼';
      case 'travel': return '✈️';
      default: return '📚';
    }
  };

  // Sohbet tipine göre renk
  const getChatColor = (type, category) => {
    if (type === 'free-chat') return 'from-[#7e90d0] to-[#b4e3fd]';
    switch (category) {
      case 'daily': return 'from-[#e57697] to-[#f7b6d2]';
      case 'business': return 'from-[#6fe388] to-[#4ade80]';
      case 'travel': return 'from-[#fbbf24] to-[#f59e0b]';
      default: return 'from-[#7e90d0] to-[#b4e3fd]';
    }
  };

  // Mesaj içeriğini güvenli bir şekilde çıkar
  const getMessageContent = (msg) => {
    try {
      if (msg.content) {
        if (typeof msg.content === 'string') {
          return msg.content;
        } else if (typeof msg.content === 'object') {
          return msg.content.message || msg.content.content || '';
        }
      } else if (msg.message) {
        if (typeof msg.message === 'string') {
          return msg.message;
        } else if (typeof msg.message === 'object') {
          return msg.message.content || msg.message.message || '';
        }
      }
      
      // Eğer hala obje ise JSON string'e çevir
      if (typeof msg.content === 'object') {
        return JSON.stringify(msg.content);
      }
      
      return '';
    } catch (error) {
      console.error('Mesaj içeriği alınamadı:', error);
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
      {/* Navbar */}
      <Navbar />

      {/* Ana içerik */}
      <div className="flex w-full max-w-6xl mx-auto mt-8 rounded-2xl overflow-hidden shadow-xl bg-white/80" style={{ height: 'calc(100vh - 200px)', minHeight: 600 }}>
        {/* Sol panel - Sohbet Geçmişi */}
        <aside className="w-1/3 min-w-[220px] max-w-xs bg-white flex flex-col border-r border-gray-100">
          {/* Başlık */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {scenarioIdFromUrl ? 'Senaryo Sohbetleri' : 'Sohbet Geçmişi'}
            </h2>
            <p className="text-sm text-gray-600">
              {chatHistoryData.length === 0
                ? 'Sohbet geçmişiniz bulunmamaktadır'
                : scenarioIdFromUrl
                  ? 'Bu senaryoya ait tüm sohbetlerinizi görüntüleyin'
                  : 'Önceki sohbetlerinizi görüntüleyin'}
            </p>
            {scenarioIdFromUrl && (
              <button
                onClick={() => navigate('/chat-history')}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors"
              >
                ← Tüm sohbetlere dön
              </button>
            )}
          </div>

          {/* Sohbet Listesi */}
          <div className="flex-1 overflow-y-auto">
            {chatHistoryData.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                  selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => handleViewChat(chat)}
              >
                <div className="flex items-start gap-3">
                  {/* İkon */}
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getChatColor(chat.type, chat.category)} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-lg">{getChatIcon(chat.type, chat.category)}</span>
                  </div>
                  
                  {/* İçerik */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {chat.scenario?.title || 'Serbest Sohbet'}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {chat.messageCount || 0} mesaj
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate mb-1">
                      {chat.lastMessage || 'Son mesaj bulunamadı'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatDate(chat.started_at)} 
                      </span>
                      <div className="flex items-center gap-1">
                        {chat.completed && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            ✅ Tamamlandı
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          chat.level === 'beginner' ? 'bg-blue-100 text-blue-800' :
                          chat.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {chat.scenario?.difficulty_level || 'Seviye bulunamadı'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
           
          </div>
        </aside>
        
        {/* Sağ panel - Sohbet Görüntüleme */}
        <main className="flex-1 flex flex-col bg-cover bg-center" style={{ backgroundImage: `url(${RegisterBackground})` }}>
          {showChat ? (
            <>
              {/* Sohbet Başlığı */}
              <div className="flex-shrink-0 bg-white/90 border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getChatColor(selectedChat.type, selectedChat.category)} flex items-center justify-center`}>
                      <span className="text-white text-lg">{getChatIcon(selectedChat.type, selectedChat.category)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{selectedChat.scenario?.title || 'Serbest Sohbet'}</h3>
                      <p className="text-sm text-gray-600">
                        {chatMessages.length || 0} mesaj • {formatDate(selectedChat.started_at)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseChat}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-500 text-xl">✕</span>
                  </button>
                </div>
              </div>

              {/* Mesajlar alanı - Scroll edilebilir */}
              <div className="flex-1 flex flex-col px-8 py-6 gap-3 overflow-y-auto min-h-0">
                <div className="flex-1 flex flex-col gap-3">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`px-5 py-2 rounded-2xl shadow text-base font-medium max-w-xs break-words ${
                        msg.sender === "user" 
                          ? "bg-white text-gray-800" 
                          : "bg-white/80 text-gray-700"
                      }`}>
                        {getMessageContent(msg)}
                      </div>
                    </div>
                  ))}
                  {/* Scroll referansı - otomatik scroll için */}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </>
          ) : (
            /* Sohbet seçilmediğinde gösterilecek mesaj */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-4xl">📖</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sohbet Geçmişi
                </h3>
                {chatHistoryData.length === 0 ? (
                  <p className="text-gray-600">
                    Henüz bir sohbet geçmişiniz yok. <br/>
                    Yeni bir sohbet başlatmak için Senaryolar  ya da Yeni Sohbet sekmesini ziyaret edebilirsiniz. 
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Sol panelden görüntülemek istediğiniz sohbeti seçin
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 