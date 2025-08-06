import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { 
  fetchUserErrorsByTopics, 
  fetchUserRadarScores,
  selectErrorsByTopics,
  selectRadarScores,
  selectCurrentPeriod,
  selectIsLoading,
  selectError,
  setCurrentPeriod
} from "../store/graphSlice";
import GrammarErrorsPieChart from "../components/Charts/GrammarErrorsPieChart";
import RadarChart from "../components/Charts/RadarChart";

export default function ProgressReport() {
  const [period, setPeriod] = useState("weekly");
  const [activeTab, setActiveTab] = useState("charts");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  
  // Graph state'leri
  const errorsByTopics = useSelector(selectErrorsByTopics);
  const radarScores = useSelector(selectRadarScores);
  const currentPeriod = useSelector(selectCurrentPeriod);
  const graphLoading = useSelector(selectIsLoading);
  const graphError = useSelector(selectError);

  // Graph verilerini yükle
  useEffect(() => {
    if (activeTab === "charts" && userInfo?.id) {
      const periodParam = period === "weekly" ? "week" : "month";
      dispatch(fetchUserErrorsByTopics(periodParam));
      dispatch(fetchUserRadarScores({ userId: userInfo.id, period: periodParam }));
      dispatch(setCurrentPeriod(period));
    }
  }, [activeTab, period, userInfo?.id, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b4e3fd] via-[#c0defb] to-[#dfd6f6]">
      {/* Navbar */}
      <Navbar />

      {/* Ana İçerik */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-2">
        <div className="w-full max-w-6xl bg-white/90 rounded-2xl shadow-xl border border-white/30 p-8">
          {/* Başlık ve Ana Sekmeler */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gelişim Raporu</h1>
            
            {/* Ana Sekmeler */}
            <div className="flex gap-4 justify-center mb-6">
              <button
                className={`px-6 py-2 rounded-full font-semibold text-base border-2 transition-all duration-200 flex items-center gap-2 ${activeTab === "charts" ? "border-[#7e90d0] bg-[#eaf0fb] text-[#7e90d0]" : "border-gray-200 bg-white text-gray-500 hover:border-[#7e90d0]"}`}
                onClick={() => setActiveTab("charts")}
              >
                <span className="w-3 h-3 rounded-full bg-[#7e90d0] inline-block" style={{ opacity: activeTab === "charts" ? 1 : 0.2 }}></span>
                📊 Grafikler
              </button>
            </div>

            {/* Alt Sekmeler - Sadece Grafikler sekmesinde göster */}
            {activeTab === "charts" && (
              <div className="flex gap-4 justify-center">
                <button
                  className={`px-6 py-2 rounded-full font-semibold text-base border-2 transition-all duration-200 flex items-center gap-2 ${period === "weekly" ? "border-[#7e90d0] bg-[#eaf0fb] text-[#7e90d0]" : "border-gray-200 bg-white text-gray-500 hover:border-[#7e90d0]"}`}
                  onClick={() => {
                    setPeriod("weekly");
                    if (userInfo?.id) {
                      dispatch(fetchUserErrorsByTopics("week"));
                      dispatch(fetchUserRadarScores({ userId: userInfo.id, period: "week" }));
                      dispatch(setCurrentPeriod("weekly"));
                    }
                  }}
                >
                  <span className="w-3 h-3 rounded-full bg-[#7e90d0] inline-block" style={{ opacity: period === "weekly" ? 1 : 0.2 }}></span>
                  Haftalık
                </button>
                <button
                  className={`px-6 py-2 rounded-full font-semibold text-base border-2 transition-all duration-200 flex items-center gap-2 ${period === "monthly" ? "border-[#7e90d0] bg-[#eaf0fb] text-[#7e90d0]" : "border-gray-200 bg-white text-gray-500 hover:border-[#7e90d0]"}`}
                  onClick={() => {
                    setPeriod("monthly");
                    if (userInfo?.id) {
                      dispatch(fetchUserErrorsByTopics("month"));
                      dispatch(fetchUserRadarScores({ userId: userInfo.id, period: "month" }));
                      dispatch(setCurrentPeriod("monthly"));
                    }
                  }}
                >
                  <span className="w-3 h-3 rounded-full bg-[#7e90d0] inline-block" style={{ opacity: period === "monthly" ? 1 : 0.2 }}></span>
                  Aylık
                </button>
              </div>
            )}
          </div>

          {/* İçerik - Koşullu Gösterim */}
          {activeTab === "charts" && (
            <>
              {/* Info Alanı */}
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#798ed9] to-[#90c3e0] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Mentor Analizi</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Mentor analizi ile tüm chatleriniz üzerinden yorum yaparak siz için detaylı önerilerde bulunup sizin hatalarınıza yönelik testler hazırlamaktayız.
                    </p>
                    <button
                      onClick={() => navigate('/mentor-analysis')}
                      className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-[#798ed9] to-[#90c3e0] text-white hover:scale-105 shadow-md"
                    >
                      🎯 Genel Analiz Başlat
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading Durumu */}
              {graphLoading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7e90d0] mx-auto mb-4"></div>
                  <p className="text-gray-600">Grafik verileri yükleniyor...</p>
                </div>
              )}

              {/* Error Durumu */}
              {graphError && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-red-700 mb-2">Hata Oluştu</h3>
                  <p className="text-red-500">{graphError}</p>
                </div>
              )}

              {/* Grafikler - Veri varsa göster */}
              {!graphLoading && !graphError && (
                <>
                  {/* Radar Chart - Dil Beceri Analizi */}
                  <div className="mb-8">
                    <RadarChart data={radarScores[currentPeriod]} period={period} />
                  </div>

                  {/* Grammar Errors Pie Chart */}
                  {errorsByTopics && errorsByTopics[currentPeriod] && (
                    <div className="mb-8">
                      <GrammarErrorsPieChart 
                        data={errorsByTopics[currentPeriod]} 
                        period={period} 
                      />
                    </div>
                  )}

                  {/* Veri Yok Durumu */}
                  {(!errorsByTopics || !errorsByTopics[currentPeriod]) && (!radarScores || !radarScores[currentPeriod]) && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📊</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Henüz Veri Yok</h3>
                      <p className="text-gray-500">
                        {period === "weekly" ? "Haftalık" : "Aylık"} veriler henüz mevcut değil. 
                        Birkaç sohbet tamamladıktan sonra burada detaylı analizleri görebilirsiniz.
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
} 