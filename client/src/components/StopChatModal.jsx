import React from 'react';

const StopChatModal = ({ isOpen, onClose, onConfirm, onCancel, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Sohbeti Durdur
          </h3>
          <p className="text-gray-600 text-sm">
            Sohbeti durdurmak istediğinize emin misiniz?
          </p>
        </div>

        {/* Modal Content */}
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">ℹ️</span>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">Bilgilendirme:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Sohbetinizi istediğiniz zaman devam edebilirsiniz</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Sohbet geçmişiniz kaydedilecektir</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold transition-all duration-200 hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
              isLoading 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] text-white hover:scale-105'
            }`}
          >
            {isLoading ? 'Analiz Yapılıyor...' : 'Sohbeti Durdur'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StopChatModal; 