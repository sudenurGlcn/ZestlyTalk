import React, { useState, useRef, useEffect } from "react";
import RegisterBackground from "../assets/RegisterBackground.png";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useDispatch } from "react-redux";
import { setSelectedScenario, startScenario, clearMessages } from "../store/scenarioSlice";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../store/userSlice";
import { canAccessScenario, getLevelDisplayName } from "../utils/levelUtils";
import { getAllScenarios, getScenarioByCategory, getUserActiveScenarios } from "../store/scenarioSlice";
import Swal from 'sweetalert2';


export default function Scenarios() {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [scenariosPerPage] = useState(9);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const profileRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  const [expandedChatCounts, setExpandedChatCounts] = useState({});
  const [selectedLevel, setSelectedLevel] = useState("");
  const levels = [
    { id: '', name: 'Tüm Seviyeler' },
    { id: 'A1', name: 'A1' },
    { id: 'A2', name: 'A2' },
    { id: 'B1', name: 'B1' },
    { id: 'B2', name: 'B2' },
    { id: 'C1', name: 'C1' },
    { id: 'C2', name: 'C2' },
  ];
  
  // LocalStorage'dan tamamlanan senaryoları al
  const getCompletedScenariosFromStorage = () => {
    try {
      const scenarioState = localStorage.getItem('scenarioState');
      if (scenarioState) {
        const parsed = JSON.parse(scenarioState);
        return parsed.userCompletedScenarios || [];
      }
    } catch (error) {
      console.error('LocalStorage\'dan tamamlanan senaryolar alınamadı:', error);
    }
    return [];
  };
  
  const userCompletedScenarios = getCompletedScenariosFromStorage();
  
  // Tamamlanan senaryo ID'lerini al
  const completedScenarioIds = userCompletedScenarios.map(chat => chat.scenario_id);
 
  const {scenarios, isLoading, error, userActiveScenarios} = useSelector((state) => state.scenario);
  // Eğer kategoriye göre senaryo gerekiyorsa aşağıdaki gibi alınabilir:
  const scenarioByCategory = useSelector((state) => state.scenario.scenarioByCategory) || [];
  // Redux state'inden scenario bilgilerini al
  const scenarioState = useSelector((state) => state.scenario);

  useEffect(() => {
    dispatch(getAllScenarios());
  }, [dispatch]);

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

  useEffect(() => {
    if (selectedCategory) {
      dispatch(getScenarioByCategory(selectedCategory));
    }
  }, [dispatch, selectedCategory]);

  // Aktif senaryo filtresi değiştiğinde kullanıcının aktif senaryolarını al
  useEffect(() => {
    if (showActiveOnly && userInfo?.id) {
      dispatch(getUserActiveScenarios(userInfo.id));
    }
  }, [showActiveOnly, userInfo?.id, dispatch]);



  // Debug için aktif ve tamamlanan senaryoları logla
  useEffect(() => {    
    if (userActiveScenarios && userActiveScenarios.length > 0) {
      // Aktif ve tamamlanan senaryoları ayır
      const activeScenarios = userActiveScenarios.filter(chat => chat.status === 'active');
      const completedChats = userActiveScenarios.filter(chat => chat.status === 'completed');
      
      // Senaryo bazında grupla
      const activeByScenario = activeScenarios.reduce((acc, chat) => {
        const scenarioId = chat.scenario_id;
        if (!acc[scenarioId]) acc[scenarioId] = [];
        acc[scenarioId].push(chat);
        return acc;
      }, {});
      
      const completedByScenario = completedChats.reduce((acc, chat) => {
        const scenarioId = chat.scenario_id;
        if (!acc[scenarioId]) acc[scenarioId] = [];
        acc[scenarioId].push(chat);
        return acc;
      }, {});

    }
  }, [userActiveScenarios, scenarios, userCompletedScenarios]);


  // URL parametresinden kategori bilgisini al
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('category');
    const forceNewParam = urlParams.get('force-new');
    
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
    }
    
    // force-new parametresini state'e kaydet
    if (forceNewParam === 'true') {
      // Bu parametre ile geldiğini işaretle
      localStorage.setItem('forceNewChat', 'true');
    }
  }, [location.search]);

  // Menü dışında tıklanınca kapansın
  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileMenuOpen]);

  const categories = [
    { id: "Günlük & Sosyal Hayat", name: "Günlük & Sosyal Hayat" },
    { id: "İş & Kariyer", name: "İş & Kariyer" },
    { id: "Seyahat & Alışveriş", name: "Seyahat & Alışveriş" },
    { id: "Fikir & Tartışma", name: "Fikir & Tartışma" },
  ];

  const categorie_icons = {
    "Günlük & Sosyal Hayat": "💼",
    "İş & Kariyer": "💼",
    "Seyahat & Alışveriş": "🌍",
    "Fikir & Tartışma": "💡",
  };

  // Tarih formatını düzenle
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    });
  };
 


  // Filtreleme fonksiyonunu güncelle
  const filteredScenarios = scenarios.filter(scenario => {
    const categoryMatch = !selectedCategory || selectedCategory === "" || scenario.category === selectedCategory;
    const levelMatch = !selectedLevel || selectedLevel === "" || scenario.difficulty_level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  // Pagination hesaplamaları
  const indexOfLastScenario = currentPage * scenariosPerPage;
  const indexOfFirstScenario = indexOfLastScenario - scenariosPerPage;
  const currentScenarios = filteredScenarios.slice(indexOfFirstScenario, indexOfLastScenario);
  const totalPages = Math.ceil(filteredScenarios.length / scenariosPerPage);

  // Sayfa değiştiğinde en üste scroll
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Kategori veya aktif filtre değiştiğinde sayfa 1'e dön
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, showActiveOnly]);
  const handleStart = async (scenario) => {
    
    // Kullanıcının bu senaryoya erişim yetkisi var mı kontrol et
    if (!userInfo?.id) {
      return;
    }
    
    if (!canAccessScenario(userInfo.level, scenario.difficulty_level)) {
      return; // Erişim yoksa hiçbir şey yapma
    }
    
    // force-new parametresi kontrolü
    const forceNewChat = localStorage.getItem('forceNewChat') === 'true';
    
    if (forceNewChat) {
      // Yeni sohbet oluştur
      try {
        const response = await fetch('http://localhost:5000/api/chats/force-new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authState') ? JSON.parse(localStorage.getItem('authState')).accessToken : ''}`
          },
          body: JSON.stringify({
            userId: userInfo.id,
            scenarioId: parseInt(scenario.id)
          })
        });

        if (response.ok) {
          // Redux store'a senaryo bilgilerini kaydet
          dispatch(setSelectedScenario({
            id: scenario.id,
            title: scenario.title,
            level: scenario.difficulty_level,
            category: scenario.category,
            description: scenario.description,
            forceUpdate: true // Yeni chat başlatılacağı için zorla güncelle
          }));

          // Chatbot sayfasına yönlendir
          navigate(`/chatbot/${scenario.id}`);
          
          // force-new flag'ini temizle
          localStorage.removeItem('forceNewChat');
        } else {
          console.error('❌ Yeni sohbet oluşturulamadı');
        }
      } catch (error) {
        console.error('❌ Yeni sohbet hatası:', error);
      }
    } else {
      // Normal akış - mevcut chat'i devam ettir
      
      // Redux state'inden mevcut chat bilgilerini al
      const currentChatId = scenarioState.chatId;
      const currentScenarioId = scenarioState.scenarioData?.id;
      const currentMessages = scenarioState.messages;
      // Farklı bir senaryo seçildiyse mesajları temizle
      const isDifferentScenario = currentScenarioId && currentScenarioId !== scenario.id;
      
      if (isDifferentScenario) {
        dispatch(clearMessages());
      }
      
      // Her zaman senaryo bilgilerini güncelle
      dispatch(setSelectedScenario({
        id: scenario.id,
        title: scenario.title,
        level: scenario.difficulty_level,
        category: scenario.category,
        description: scenario.description,
        forceUpdate: true
      }));
      
      // Sadece chat yoksa veya farklı senaryo seçildiyse startScenario dispatch et
      const shouldDispatch = !currentChatId || isDifferentScenario;
      
      if (shouldDispatch) {
        try {
          const result = await dispatch(startScenario({ 
            scenarioId: parseInt(scenario.id), 
            userId: userInfo.id, 
            level: `${scenario.difficulty_level}`
          })).unwrap();
        } catch (error) {
        }
      } else {
      }
      // Chatbot sayfasına yönlendir
      navigate(`/chatbot/${scenario.id}`);
    }
  };

  // Aktif ve tamamlanan senaryoları ayır
  const activeScenarios = userActiveScenarios.filter(chat => chat.status === 'active');
  // Tamamlanan senaryoları localStorage'dan al
  const completedChats = userCompletedScenarios;

  // Seçili kategori ve seviyeye göre senaryoları filtrele
  const filteredScenariosForChats = scenarios.filter(scenario => {
    const categoryMatch = !selectedCategory || selectedCategory === "" || scenario.category === selectedCategory;
    const levelMatch = !selectedLevel || selectedLevel === "" || scenario.difficulty_level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  // Filtrelenmiş senaryo ID'lerini al
  const filteredScenarioIds = filteredScenariosForChats.map(scenario => scenario.id);

  // Aktif senaryoları filtrele ve grupla
  const filteredActiveScenarios = activeScenarios.filter(chat => 
    filteredScenarioIds.includes(chat.scenario_id)
  );

  const groupedActiveScenarios = filteredActiveScenarios.reduce((acc, activeChat) => {
    const scenarioId = activeChat.scenario_id;
    if (!acc[scenarioId]) {
      acc[scenarioId] = [];
    }
    
    // Her chat'in kendi tarihini kullan
    const createdDate = new Date(activeChat.created_at || activeChat.createdAt || Date.now());
    const formattedDate = createdDate.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    });
    
    acc[scenarioId].push({
      ...activeChat,
      created_at: formattedDate,
      originalDate: createdDate
    });
    return acc;
  }, {});

  // Tamamlanan senaryoları filtrele ve grupla
  const filteredCompletedChats = completedChats.filter(chat => 
    filteredScenarioIds.includes(chat.scenario_id)
  );

  const groupedCompletedScenarios = filteredCompletedChats.reduce((acc, completedChat) => {
    const scenarioId = completedChat.scenario_id;
    if (!acc[scenarioId]) {
      acc[scenarioId] = [];
    }
    
    // Her chat'in kendi tarihini kullan
    const createdDate = new Date(completedChat.started_at || completedChat.created_at || completedChat.createdAt || Date.now());
    const formattedDate = createdDate.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    });
    
    acc[scenarioId].push({
      ...completedChat,
      created_at: formattedDate,
      originalDate: createdDate
    });
    return acc;
  }, {});

  // Aktif senaryoları tarihe göre sırala (en yeni önce)
  Object.keys(groupedActiveScenarios).forEach(scenarioId => {
    groupedActiveScenarios[scenarioId].sort((a, b) => 
      b.originalDate - a.originalDate
    );
  });

  // Tamamlanan senaryoları tarihe göre sırala (en yeni önce)
  Object.keys(groupedCompletedScenarios).forEach(scenarioId => {
    groupedCompletedScenarios[scenarioId].sort((a, b) => 
      b.originalDate - a.originalDate
    );
  });


  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url(${RegisterBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Navbar */}
     <Navbar />

      {/* Ana İçerik */}
      <main className="flex-1 px-6 py-8">
        {/* Ana Kart */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-full max-w-6xl bg-white/80 rounded-2xl shadow-lg border border-white/40 px-4 py-5 flex flex-col items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-3">
                {localStorage.getItem('forceNewChat') === 'true' ? (
                  <span>
                    🆕 Yeni Sohbet - {selectedCategory && selectedCategory !== "" 
                      ? `${categories.find(cat => cat.id === selectedCategory)?.name || 'Kategori'} Senaryoları`
                      : "Bir Pratik Konusu Seçin"}
                  </span>
                ) : (
                  selectedCategory && selectedCategory !== "" 
                    ? `${categories.find(cat => cat.id === selectedCategory)?.name || 'Kategori'} Senaryoları`
                    : "Bir Pratik Konusu Seçin"
                )}
              </h1>
              
              {/* Tamamlanma İstatistikleri */}
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-[#6fe388] to-[#4ade80] rounded-full flex items-center justify-center">
                      <span className="text-xs">✅</span>
                    </div>
                    <span className="text-green-800">
                      <strong>{completedScenarioIds.length}</strong> tamamlandı
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] rounded-full flex items-center justify-center">
                      <span className="text-xs">🎯</span>
                    </div>
                    <span className="text-blue-600">
                      <strong>{scenarios.length - completedScenarioIds.length}</strong> kaldı
                    </span>
                  </div>
                </div>
              </div>
              
                             <div className="flex flex-col gap-4">
                 {/* Kategori Butonları */}
                 <div className="flex gap-2 sm:gap-4 justify-center">
                   {/* Tüm Kategoriler Butonu */}
                   <button
                     onClick={() => setSelectedCategory("")}
                     className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 border-2 ${
                       selectedCategory === ""
                         ? "bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] text-white border-[#7e90d0] shadow"
                         : "bg-white text-gray-700 border-gray-200 hover:border-[#b4e3fd]"
                     }`}
                   >
                     Tüm Kategoriler
                   </button>
                   
                   {/* Kategori Butonları */}
                   {categories.map((category) => (
                     <button
                       key={category.id}
                       onClick={() => setSelectedCategory(category.id)}
                       className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 border-2 ${
                         selectedCategory === category.id
                           ? "bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] text-white border-[#7e90d0] shadow"
                           : "bg-white text-gray-700 border-gray-200 hover:border-[#b4e3fd]"
                       }`}
                     >
                       {category.name}
                     </button>
                   ))}
                 </div>
                 {/* Seviye Butonları */}
                 <div className="flex flex-wrap justify-center mr-24 gap-2 mt-4">
                   {levels.map((level) => (
                     <button
                       key={level.id}
                       onClick={() => setSelectedLevel(level.id)}
                       className={`flex items-center justify-center border text-sm font-semibold transition
                         ${level.id === "" 
                           ? 'px-4 py-2 mr-2 rounded-lg' // Tüm Seviyeler için daha geniş
                           : 'w-10 h-10 rounded-full' // Diğerleri için yuvarlak badge
                         }
                         ${selectedLevel === level.id
                           ? 'bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] text-white border-[#7e90d0] shadow-lg scale-110'
                           : 'bg-white text-gray-700 border-gray-300 hover:bg-[#f3f4f6] hover:border-[#7e90d0]'}
                       `}
                       style={level.id === "" ? {} : { minWidth: '2.5rem' }}
                       title={level.name}
                     >
                       {level.name}
                     </button>
                   ))}
                 </div>
                 
                 {/* Filtre Butonları */}
                 <div className="flex justify-center gap-2">
                   <button
                     onClick={() => {
                       setShowActiveOnly(false);
                       setShowCompletedOnly(false);
                     }}
                     className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border-2 flex items-center gap-2 ${
                       !showActiveOnly && !showCompletedOnly
                         ? "bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] text-white border-[#7e90d0] shadow"
                         : "bg-white text-gray-700 border-gray-200 hover:border-[#7e90d0]"
                     }`}
                   >
                     <span className="text-lg">📋</span>
                     Tüm Senaryolar
                   </button>
                   <button
                     onClick={() => {
                       setShowActiveOnly(!showActiveOnly);
                       setShowCompletedOnly(false);
                     }}
                     className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border-2 flex items-center gap-2 ${
                       showActiveOnly
                         ? "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-white border-[#f59e0b] shadow"
                         : "bg-white text-gray-700 border-gray-200 hover:border-[#f59e0b]"
                     }`}
                   >
                     <span className="text-lg">🔥</span>
                     {showActiveOnly ? `Aktif (${Object.keys(groupedActiveScenarios).length})` : 'Aktif Sohbetler'}
                   </button>
                   
                   <button
                     onClick={() => {
                       setShowCompletedOnly(!showCompletedOnly);
                       setShowActiveOnly(false);
                     }}
                     className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border-2 flex items-center gap-2 ${
                       showCompletedOnly
                         ? "bg-gradient-to-r from-[#6fe388] to-[#4ade80] text-white border-[#4ade80] shadow"
                         : "bg-white text-gray-700 border-gray-200 hover:border-[#4ade80]"
                     }`}
                   >
                     <span className="text-lg">✅</span>
                     {showCompletedOnly ? `Tamamlanan (${Object.keys(groupedCompletedScenarios).length})` : 'Tamamlanan Sohbetler'}
                   </button>
                 </div>
               </div>
            </div>
          </div>

          {/* Aktif Senaryolar Bölümü */}
          {showActiveOnly && (
            <div className="w-full max-w-6xl bg-white/70 rounded-2xl shadow-lg border border-white/40 p-6 mx-auto mb-6">
              <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">🔥 Aktif Sohbetlerim</h2>
                <p className="text-gray-600 text-sm">
                  Toplam <strong>{Object.keys(groupedActiveScenarios).length}</strong> farklı senaryoda aktif sohbet
                </p>
              </div>

              {Object.keys(groupedActiveScenarios).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(groupedActiveScenarios).map(([scenarioId, chats]) => {
                    const scenario = scenarios.find(s => s.id == scenarioId);
                    if (!scenario) return null;

                    return (
                      <div key={scenarioId} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] rounded-lg flex items-center justify-center">
                            <span className="text-lg">{categorie_icons[scenario.category]}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-sm">{scenario.title}</h3>
                            <p className="text-xs text-gray-500">{scenario.category}</p>
                          </div>
                          <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                            {chats.length} sohbet
                          </div>
                        </div>

                        <div className="space-y-2">
                          {chats.slice(0, expandedChatCounts[scenarioId] || 3).map((chat, index) => (
                            <div key={chat.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <p className="text-xs text-gray-600">
                                  Sohbet #{index + 1}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(chat.started_at)}
                                </p>
                              </div>
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  // Senaryo bilgilerini güncelle
                                  const scenario = scenarios.find(s => s.id == scenarioId);
                                  if (scenario) {
                                    dispatch(setSelectedScenario({
                                      id: scenario.id,
                                      title: scenario.title,
                                      level: scenario.difficulty_level,
                                      category: scenario.category,
                                      description: scenario.description,
                                      milestones: userActiveScenarios.find(s => s.scenario_id === scenario.id)?.scenario.milestones_tr,
                                      scenario_info: userActiveScenarios.find(s => s.scenario_id === scenario.id)?.scenario.scenario_info
                                      
                                    }));
                                  }
                                  // Bu chat'e devam et - chatId ile yönlendir
                                  navigate(`/chatbot/${scenarioId}?chatId=${chat.id}`);
                                }}
                                className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Devam Et
                              </button>
                            </div>
                          ))}
                          {chats.length > (expandedChatCounts[scenarioId] || 3) && (
                            <div className="text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Bu senaryo için gösterilen sohbet sayısını artır
                                  setExpandedChatCounts(prev => ({
                                    ...prev,
                                    [scenarioId]: (prev[scenarioId] || 3) + 1
                                  }));
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors"
                              >
                                +{chats.length - (expandedChatCounts[scenarioId] || 3)} sohbet daha
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-3xl">🔥</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Henüz Aktif Senaryonuz Bulunmamaktadır</h3>
                  <p className="text-gray-600 mb-4">
                    Aktif sohbetlerinizi görmek için önce bir senaryo başlatın.
                  </p>
                  <button
                    onClick={() => {
                      setShowActiveOnly(false);
                      setShowCompletedOnly(false);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200"
                  >
                    Senaryoları Keşfet
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tamamlanan Senaryolar Bölümü */}
          {showCompletedOnly && (
            <div className="w-full max-w-6xl bg-white/70 rounded-2xl shadow-lg border border-white/40 p-6 mx-auto mb-6">
              <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">✅ Tamamlanan Sohbetlerim</h2>
                <p className="text-gray-600 text-sm">
                  Toplam <strong>{Object.keys(groupedCompletedScenarios).length}</strong> farklı senaryoda tamamlanan sohbet
                </p>
              </div>

              {Object.keys(groupedCompletedScenarios).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(groupedCompletedScenarios).map(([scenarioId, chats]) => {
                    const scenario = scenarios.find(s => s.id == scenarioId);
                    if (!scenario) return null;

                    return (
                      <div key={scenarioId} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#6fe388] to-[#4ade80] rounded-lg flex items-center justify-center">
                            <span className="text-lg">{categorie_icons[scenario.category]}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-sm">{scenario.title}</h3>
                            <p className="text-xs text-gray-500">{scenario.category}</p>
                          </div>
                          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {chats.length} sohbet
                          </div>
                        </div>

                        <div className="space-y-2">
                          {chats.slice(0, expandedChatCounts[scenarioId] || 3).map((chat, index) => (
                            <div key={chat.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <p className="text-xs text-gray-600">
                                  Sohbet #{index + 1}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {chat.created_at}
                                </p>
                              </div>
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  // Senaryo bilgilerini güncelle
                                  const scenario = scenarios.find(s => s.id == scenarioId);
                                  if (scenario) {
                                    dispatch(setSelectedScenario({
                                      id: scenario.id,
                                      title: scenario.title,
                                      level: scenario.difficulty_level,
                                      category: scenario.category,
                                      description: scenario.description
                                    }));
                                  }
                                  // Bu chat'e devam et - chatId ile yönlendir
                                  navigate(`/chatbot/${scenarioId}?chatId=${chat.id}`);
                                }}
                                className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                              >
                                Görüntüle
                              </button>
                            </div>
                          ))}
                          {chats.length > (expandedChatCounts[scenarioId] || 3) && (
                            <div className="text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Bu senaryo için gösterilen sohbet sayısını artır
                                  setExpandedChatCounts(prev => ({
                                    ...prev,
                                    [scenarioId]: (prev[scenarioId] || 3) + 1
                                  }));
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors"
                              >
                                +{chats.length - (expandedChatCounts[scenarioId] || 3)} sohbet daha
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#6fe388] to-[#4ade80] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-3xl">✅</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Henüz Tamamlanan Senaryo Bulunmamaktadır</h3>
                  <p className="text-gray-600 mb-4">
                    Tamamlanan sohbetlerinizi görmek için önce bir senaryo tamamlayın.
                  </p>
                  <button
                    onClick={() => {
                      setShowActiveOnly(false);
                      setShowCompletedOnly(false);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200"
                  >
                    Senaryoları Keşfet
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Senaryo Kartları - Sadece aktif modda değilse göster */}
          {!showActiveOnly && !showCompletedOnly && (
            <div className="w-full max-w-6xl bg-white/70 rounded-2xl shadow-lg border border-white/40 p-6 mx-auto">
              {/* Toplam senaryo sayısı */}
              <div className="mb-4 text-center">
                <p className="text-gray-600 text-sm">
                  Toplam <strong>{filteredScenarios.length}</strong> senaryo bulundu
                  {selectedCategory && selectedCategory !== "" && (
                    <span className="ml-2 text-blue-600">
                      ({selectedCategory} kategorisinde)
                    </span>
                  )}
                </p>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentScenarios.map((scenario) => {
                const canAccess = canAccessScenario(userInfo.level, scenario.difficulty_level);  
                return (
                  <div
                    key={scenario.id}
                    className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 transition-all duration-300 ${
                      canAccess 
                        ? 'hover:shadow-xl hover:scale-105 cursor-pointer' 
                        : 'opacity-70 cursor-not-allowed bg-gray-50'
                    }`}
                    onClick={() => canAccess && handleStart(scenario)}
                  >
                                         <div className="text-center mb-4 relative">
                       {/* Tamamlanma Badge'i - sol üst köşe */}
                       <div className="absolute top-0 left-0">
                         {completedScenarioIds.includes(scenario.id) ? (
                           <div className="w-8 h-8 bg-gradient-to-r from-[#6fe388] to-[#4ade80] rounded-full flex items-center justify-center shadow-lg">
                             <span className="text-sm">✅</span>
                           </div>
                         ) : (
                           <div className="w-8 h-8 bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] rounded-full flex items-center justify-center shadow-lg">
                             <span className="text-sm">🎯</span>
                           </div>
                         )}
                       </div>
                       
                                               {/* Aktif Senaryo Badge'i - sağ üst köşe */}
                        {userActiveScenarios.some(activeScenario => activeScenario.scenario_id === scenario.scenario_id) && (
                          <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-sm">🔥</span>
                          </div>
                        )}
                       
                       {/* Kilit simgesi - erişim yoksa göster (sağ alt köşe) */}
                       {!canAccess && (
                         <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                           <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                           </svg>
                         </div>
                       )}
                      
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                        canAccess 
                          ? 'bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd]' 
                          : 'bg-gray-300'
                      }`}>
                        <span className="text-2xl">{categorie_icons[scenario.category]}</span>
                      </div>
                      
                                             <h3 className="text-xl font-bold text-gray-800 mb-2">{scenario.title}</h3>
                       <p className="text-gray-500 text-sm mb-2">
                         Seviye: {getLevelDisplayName(scenario.difficulty_level)}
                       </p>
                       <p className="text-gray-600 text-xs mb-2">{scenario.description}</p>
                       
                                               {/* Durum bilgisi */}
                        {userActiveScenarios.some(activeScenario => activeScenario.scenario_id === scenario.scenario_id) && (
                          <div className="flex justify-center mb-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              🔥 Aktif
                            </span>
                          </div>
                        )}
                      
                      {/* Erişim uyarısı */}
                      {!canAccess && (
                        <div className="mt-2 p-2 bg-orange-100 border border-orange-300 rounded-lg">
                          <p className="text-xs text-orange-800 text-center">
                            🔒 Bu senaryo için {getLevelDisplayName(scenario.difficulty_level)} seviyesi gereklidir
                            <br />
                            <span className="text-orange-600">Mevcut seviyeniz: {getLevelDisplayName(userInfo.level)}</span>
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        className={`w-3/4 mr-auto ml-auto py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                          canAccess
                            ? 'bg-gradient-to-r from-[#e57697] to-[#f7b6d2] text-white hover:scale-105'
                            : 'bg-gray-400 text-gray-600 cursor-not-allowed border-2 border-gray-300'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (canAccess) handleStart(scenario);
                        }}
                        disabled={!canAccess}
                      >
                        {canAccess ? (localStorage.getItem('forceNewChat') === 'true' ? '🆕 Yeni Sohbet' : 'Başla') : '🔒 Kilitli'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination - Sadece aktif modda değilse göster */}
            {totalPages > 1 && !showActiveOnly && !showCompletedOnly && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2 bg-white/80 rounded-xl p-2 shadow-lg border border-white/40">
                  {/* İlk Sayfa */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    İlk
                  </button>

                  {/* Önceki Sayfa */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    ←
                  </button>

                  {/* Sayfa Numaraları */}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                            currentPage === pageNumber
                              ? 'bg-gradient-to-r from-[#b4e3fd] to-[#7e90d0] text-white shadow-md'
                              : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  {/* Sonraki Sayfa */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    →
                  </button>

                  {/* Son Sayfa */}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    Son
                  </button>
                </div>
              </div>
            )}

            {/* Sayfa Bilgisi */}
            {totalPages > 1 && !showActiveOnly && !showCompletedOnly && (
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm">
                  Sayfa <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
                  <span className="ml-2 text-blue-600">
                    ({indexOfFirstScenario + 1}-{Math.min(indexOfLastScenario, filteredScenarios.length)} / {filteredScenarios.length} senaryo)
                  </span>
                </p>
              </div>
            )}
          </div>
          )}
        </div>  
      </main>
    </div>
  );
} 