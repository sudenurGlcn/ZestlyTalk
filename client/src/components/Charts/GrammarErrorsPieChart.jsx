import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const GrammarErrorsPieChart = ({ data, period }) => {
  if (!data || !data.topicsCount || data.topicsCount.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Konu Bazında Grammar Hataları</h3>
        <p className="text-gray-500">
          {period === "weekly" ? "Haftalık" : "Aylık"} grammar hata verileri henüz mevcut değil. <br/>
          Dilbilgisi özetini görüntülemek için senaryolar üzerinde çalışmalısınız.
        </p>
      </div>
    );
  }

  // Toplam hata sayısını hesapla
  const totalErrors = data.topicsCount.reduce((sum, topic) => sum + parseInt(topic.total_errors), 0);

  // Chart verilerini hazırla
  const chartData = {
    labels: data.topicsCount.map(topic => topic.error_topic),
    datasets: [
      {
        data: data.topicsCount.map(topic => parseInt(topic.total_errors)),
        backgroundColor: [
          '#3B82F6', // Blue
          '#10B981', // Green
          '#F59E0B', // Yellow
          '#EF4444', // Red
          '#8B5CF6', // Purple
          '#06B6D4', // Cyan
          '#F97316', // Orange
          '#84CC16', // Lime
          '#EC4899', // Pink
          '#6366F1', // Indigo
          '#14B8A6', // Teal
          '#F43F5E', // Rose
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = ((value / totalErrors) * 100).toFixed(1);
            return `${label}: ${value} hata (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Başlık ve Özet */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Konu Bazında Grammar Hataları
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{totalErrors}</div>
            <div className="text-sm text-gray-600">Toplam Hata</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">Dönem: {period === "weekly" ? "Haftalık" : "Aylık"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Konu Sayısı: {data.topicsCount.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-700">Başlangıç: {new Date(data.startDate).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Hata Dağılımı</h3>
        
        <div className="h-80">
          <Pie data={chartData} options={options} />
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{totalErrors}</div>
            <div className="text-sm text-gray-600">Toplam Hata</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{data.topicsCount.length}</div>
            <div className="text-sm text-gray-600">Farklı Konu</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {data.topicsCount.length > 0 ? (totalErrors / data.topicsCount.length).toFixed(1) : 0}
            </div>
            <div className="text-sm text-gray-600">Ortalama Hata</div>
          </div>
        </div>
      </div>

      {/* En Çok Hata Yapılan Konular */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">En Çok Hata Yapılan Konular</h3>
        
        <div className="space-y-3">
          {[...data.topicsCount]
            .sort((a, b) => parseInt(b.total_errors) - parseInt(a.total_errors))
            .slice(0, 5)
            .map((topic, index) => {
              const errorCount = parseInt(topic.total_errors);
              const percentage = ((errorCount / totalErrors) * 100).toFixed(1);
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">{topic.error_topic}</span>
                      <div className="text-xs text-gray-500">{percentage}%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">{topic.total_errors}</div>
                    <div className="text-xs text-gray-500">hata</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default GrammarErrorsPieChart; 