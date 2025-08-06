import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ChatAnalysisBackground from "../assets/ChatAnalysisBackground.png";
import Navbar from "../components/Navbar/Navbar";
import { useSelector } from "react-redux";

export default function ChatAnalysis() {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [tab, setTab] = useState("summary");
  const profileRef = useRef();
  const { user } = useAuth();
  
  // Redux state'lerini al
  const { conversationSummary } = useSelector((state) => state.scenario);

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

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url(${ChatAnalysisBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Ana içerik */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-2">
        <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-xl border border-white/30 p-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Sohbet Analizi</h1>
          {/* Sekmeler */}
          <div className="flex gap-4 mb-8">
            <button
              className={`px-6 py-2 rounded-full font-semibold text-base border-2 transition-all duration-200 flex items-center gap-2 ${tab === "summary" ? "border-[#7e90d0] bg-[#eaf0fb] text-[#7e90d0]" : "border-gray-200 bg-white text-gray-500 hover:border-[#7e90d0]"}`}
              onClick={() => setTab("summary")}
            >
              <span className="w-3 h-3 rounded-full bg-[#7e90d0] inline-block" style={{ opacity: tab === "summary" ? 1 : 0.2 }}></span>
              Özet
            </button>
            <button
              className={`px-6 py-2 rounded-full font-semibold text-base border-2 transition-all duration-200 flex items-center gap-2 ${tab === "recommendations" ? "border-[#e57697] bg-[#f7b6d2]/40 text-[#e57697]" : "border-gray-200 bg-white text-gray-500 hover:border-[#e57697]"}`}
              onClick={() => setTab("recommendations")}
            >
              <span className="w-3 h-3 rounded-full bg-[#e57697] inline-block" style={{ opacity: tab === "recommendations" ? 1 : 0.2 }}></span>
              Öneriler
            </button>
          </div>
          {/* İçerik */}
          {conversationSummary ? (
            <div className="w-full">
              {tab === "summary" && (
                <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Sohbet Özeti
                  </h2>
                  <div className="text-gray-800 leading-relaxed">
                    {conversationSummary.summary || "Henüz analiz yapılmamış."}
                  </div>
                </div>
              )}
              
              {tab === "recommendations" && (
                <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    Öğrenme Önerileri
                  </h2>
                  {conversationSummary.recommendations && conversationSummary.recommendations.length > 0 ? (
                    <ul className="space-y-3">
                      {conversationSummary.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <span className="text-blue-600 font-bold text-lg">{index + 1}</span>
                          <span className="text-gray-800">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Henüz öneri bulunmuyor.</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Analiz Bulunamadı</h3>
              <p className="text-gray-500">
                Sohbet analizi henüz yapılmamış. Bir sohbeti durdurduğunuzda burada analiz sonuçlarını görebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 