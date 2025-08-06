import React, { useState } from 'react';

const ScenarioCompletionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onContinue,
  isLoading = false,
  completionStatus = null 
}) => {
  const [isChecking, setIsChecking] = useState(false);

  const handleConfirm = async () => {
    setIsChecking(true);
    try {
      await onConfirm();
    } catch (error) {
    
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        
        {/* Loading Durumu */}
        {isLoading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6fe388] mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Senaryo Tamamlanması Kontrol Ediliyor...
            </h3>
            <p className="text-gray-600 text-sm">
              Lütfen bekleyin, sistem senaryonuzu değerlendiriyor.
            </p>
          </div>
        )}

        {/* Başarılı Tamamlama */}
        {completionStatus === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#6fe388] to-[#4ade80] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Tebrikler! Senaryo Tamamlandı
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Senaryonuzu başarıyla tamamladınız. İlerlemeniz kaydedildi.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6fe388] to-[#4ade80] text-white font-semibold text-lg shadow-md transition-all duration-200 hover:scale-105"
            >
              Tamam
            </button>
          </div>
        )}

        {/* Başarısız Tamamlama */}
        {completionStatus === 'failed' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Senaryo Henüz Tamamlanmadı
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Senaryoyu tamamlamak için daha fazla pratik yapmanız gerekiyor. 
              Sohbete devam ederek daha iyi sonuçlar elde edebilirsiniz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onContinue}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] text-white font-semibold text-lg shadow-md transition-all duration-200 hover:scale-105"
              >
                Sohbete Devam Et
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-gray-300 text-gray-700 font-semibold text-lg shadow-md transition-all duration-200 hover:bg-gray-400"
              >
                Kapat
              </button>
            </div>
          </div>
        )}

        {/* İlk Açılış - Onay Modalı */}
        {!isLoading && completionStatus === null && (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Senaryoyu Tamamlamak İstiyor musunuz?
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Senaryonuzun tamamlanıp tamamlanmadığı kontrol edilecek. 
              Eğer yeterli pratik yaptıysanız senaryo tamamlanacak.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                disabled={isChecking}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#6fe388] to-[#4ade80] text-white font-semibold text-lg shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50"
              >
                {isChecking ? 'Kontrol Ediliyor...' : 'Evet, Tamamla'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-gray-300 text-gray-700 font-semibold text-lg shadow-md transition-all duration-200 hover:bg-gray-400"
              >
                İptal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioCompletionModal; 