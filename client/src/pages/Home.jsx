import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar/Navbar";
import Swal from 'sweetalert2';
export default function Home() {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef();
  const user = useSelector(selectUser);
  const userName = user ? `${user.first_name} ${user.last_name}` : '';
  const userInfo = user;
  const navigate = useNavigate();

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

  // Level kontrolü - kullanıcının seviyesi null ise uyarı göster
  useEffect(() => {
    if (userInfo && userInfo.level === null) {
      Swal.fire({
        icon: 'warning',
        title: 'Seviye Testi Gerekli',
        html: `
          <div class="text-center">
            <p class="mb-4">Senaryoları kullanabilmek için önce seviye testinizi çözmeniz gerekmektedir.</p>
            <div class="mt-12 mb-4">
              <button id="test-button" class="bg-gradient-to-r from-[#798ed9] to-[#90c3e0] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#6a7bc0] hover:to-[#a3d2ed] transition-all duration-200 shadow-md text-base">
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

  const features = [
    {
      id: 1,
      title: "Yeni Sohbet",
      description: "AI ile yeni bir konuşma başlatın ve İngilizce pratik yapın",
      icon: "💬",
      color: "from-[#b4e3fd] to-[#c0defb]",
      buttonColor: "bg-[#7e90d0] hover:bg-[#b4e3fd]",
      onClick: () => {
        if (userInfo && userInfo.level === null) {
          Swal.fire({
            icon: 'warning',
            title: 'Seviye Testi Gerekli',
            html: `
              <div class="text-center">
                <p class="mb-8">Senaryoları kullanabilmek için önce seviye testinizi çözmeniz gerekmektedir.</p>
                <div class="mt-12 mb-4">
                  <button id="test-button" class="bg-gradient-to-r from-[#798ed9] to-[#90c3e0] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#6a7bc0] hover:to-[#a3d2ed] transition-all duration-200 shadow-md text-base">
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
        } else {
          navigate("/new-chat");
        }
      }
    },
    {
      id: 2,
      title: "Sohbet Geçmişi",
      description: "Önceki konuşmalarınızı görüntüleyin ve devam edin",
      icon: "📚",
      color: "from-[#c0defb] to-[#d6dbfa]",
      buttonColor: "bg-[#b678b4] hover:bg-[#dc8dda]",
      onClick: () => navigate("/chat-history")
    },
    {
      id: 3,
      title: "Grafiklerim",
      description: "İlerleme durumunuzu ve istatistiklerinizi takip edin",
      icon: "📊",
      color: "from-[#d6dbfa] to-[#dfd6f6]",
      buttonColor: "bg-[#7e90d0] hover:bg-[#b4e3fd]",
      onClick: () => navigate("/progress-report")
    },
    {
      id: 4,
      title: "Senaryolar",
      description: "Farklı durumlarda İngilizce pratik yapın",
      icon: "🎭",
      color: "from-[#dfd6f6] to-[#f7b6d2]",
      buttonColor: "bg-[#b678b4] hover:bg-[#dc8dda]",
      onClick: () => {
        if (userInfo && userInfo.level === null) {
          Swal.fire({
            icon: 'warning',
            title: 'Seviye Testi Gerekli',
            html: `
              <div class="text-center">
                <p class="mb-8">Senaryoları kullanabilmek için önce seviye testinizi çözmeniz gerekmektedir.</p>
                <div class="mt-12 mb-4">
                  <button id="test-button" class="bg-gradient-to-r from-[#798ed9] to-[#90c3e0] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#6a7bc0] hover:to-[#a3d2ed] transition-all duration-200 shadow-md text-base">
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
        } else {
          navigate("/scenarios");
        }
      }
    },
         {
       id: 5,
       title: "Testler",
       description: "Bilginizi test edin ve seviyenizi ölçün",
       icon: "✍️",
       color: "from-[#f7b6d2] to-[#b4e3fd]",
       buttonColor: "bg-[#7e90d0] hover:bg-[#b4e3fd]",
       onClick: () => navigate("/tests")
     }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b4e3fd] via-[#c0defb] to-[#dfd6f6]">
      {/* Navbar */}
      <Navbar />

      {/* Ana İçerik */}
      <main className="flex-1 px-6 py-8">
        {/* Hoş Geldin Mesajı */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Hoş Geldin, {userName || 'Kullanıcı'}! 👋
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            İngilizce öğrenme yolculuğuna devam etmek için aşağıdaki özelliklerden birini seçin
          </p>
        </div>

        {/* Özellik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <span className="text-4xl ml-auto mr-auto">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
              <button 
                className={`w-full py-3 px-4 rounded-xl text-white font-semibold transition-all duration-200 ${feature.buttonColor}`}
                onClick={feature.onClick}
              >
                Başla
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}