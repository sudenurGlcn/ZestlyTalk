import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../store/authSlice';
import { selectIsAuthenticated } from '../store/authSlice';
import { updateUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import Navbar from '../components/Navbar/Navbar.jsx';
import Swal from 'sweetalert2';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  // Kullanıcı bilgilerini authSlice'dan al
  const userInfo = user;
  const userName = user ? `${user.first_name} ${user.last_name}` : '';
  const userLevel = user?.level || '';
  const userEmail = user?.email || '';
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [emailData, setEmailData] = useState({
    newEmail: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formData, setFormData] = useState({
    first_name: userInfo?.first_name || '',
    last_name: userInfo?.last_name || '',
    email: userEmail || ''
  });

  // userInfo değiştiğinde formData'yı güncelle
  useEffect(() => {
    setFormData({
      first_name: userInfo?.first_name || '',
      last_name: userInfo?.last_name || '',
      email: userInfo?.email || ''
    });
  }, [userInfo]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // fetchPerformanceStats();
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await userService.updateUserProfile(userInfo?.id, formData);
      setEditMode(false);
      
      // Redux store'u güncelle
      dispatch(updateUser(formData));
      
      // Başarılı bildirim
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Profil bilgileriniz başarıyla güncellendi.',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#7e90d0'
      });
    } catch (error) {
      // Hata bildirimi
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: error.response?.data?.message || 'Profil güncellenirken bir hata oluştu.',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Yeni şifreler eşleşmiyor');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    try {
      setLoading(true);
      await userService.updatePassword(userInfo?.id, passwordData.currentPassword, passwordData.newPassword);
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Başarılı bildirim
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Şifreniz başarıyla güncellendi.',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#7e90d0'
      });
    } catch (error) {
      if (error.response?.data?.message) {
        setPasswordError(error.response.data.message);
      } else {
        setPasswordError('Şifre güncellenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
    setEmailError('');
  };

  const handleEmailUpdate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.newEmail)) {
      setEmailError('Geçersiz email formatı');
      return;
    }

    try {
      setLoading(true);
      const response = await userService.updateEmail(userInfo?.id, emailData.newEmail);
      setShowEmailModal(false);
      setEmailData({
        newEmail: ''
      });
      
      // Redux store'u güncelle
      dispatch(updateUser({ email: emailData.newEmail }));
      
      // Başarılı bildirim
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Email adresiniz başarıyla güncellendi.',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#7e90d0'
      });
    } catch (error) {
      if (error.response?.data?.message) {
        setEmailError(error.response.data.message);
      } else {
        setEmailError('Email güncellenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      'A1': 'bg-green-100 text-green-800',
      'A2': 'bg-blue-100 text-blue-800',
      'B1': 'bg-purple-100 text-purple-800',
      'B2': 'bg-red-100 text-red-800',
      'C1': 'bg-indigo-100 text-indigo-800',
      'C2': 'bg-pink-100 text-pink-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getLevelText = (level) => {
    const texts = {
      'A1': 'A1 Başlangıç',
      'A2': 'A2 Temel',
      'B1': 'B1 Orta',
      'B2': 'B2 İleri Orta',
      'C1': 'C1 İleri',
      'C2': 'C2 Çok İleri'
    };
    return texts[level] || 'Belirtilmemiş';
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
     
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {userInfo?.first_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {userInfo?.first_name} {userInfo?.last_name}
              </h1>
              <p className="text-gray-600">{userEmail}</p>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(userLevel)}`}>
                  {getLevelText(userLevel)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-[#7e90d0] border-b-2 border-[#7e90d0]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="material-icons mr-2">person</span>
              Profil Bilgileri
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-[#7e90d0] border-b-2 border-[#7e90d0]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="material-icons mr-2">settings</span>
              Ayarlar
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {activeTab === 'profile' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Profil Bilgileri</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 bg-[#7e90d0] text-white rounded-lg hover:bg-[#6a7bc0] transition-colors"
                >
                  <span className="material-icons mr-2">edit</span>
                  {editMode ? 'İptal' : 'Düzenle'}
                </button>
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7e90d0] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Soyad
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7e90d0] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7e90d0] focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                                         <button
                       onClick={async () => {
                         if (formData.first_name !== userInfo?.first_name || 
                             formData.last_name !== userInfo?.last_name || 
                             formData.email !== userInfo?.email) {
                           const result = await Swal.fire({
                             icon: 'question',
                             title: 'Değişiklikleri Kaydetmek İstiyor musunuz?',
                             text: 'Kaydedilmemiş değişiklikleriniz kaybolacak.',
                             showCancelButton: true,
                             confirmButtonText: 'Evet, Kaydet',
                             cancelButtonText: 'Hayır, İptal Et',
                             confirmButtonColor: '#7e90d0',
                             cancelButtonColor: '#6b7280'
                           });
                           
                           if (result.isConfirmed) {
                             await handleSave();
                           } else {
                             setEditMode(false);
                             setFormData({
                               first_name: userInfo?.first_name || '',
                               last_name: userInfo?.last_name || '',
                               email: userInfo?.email || ''
                             });
                           }
                         } else {
                           setEditMode(false);
                         }
                       }}
                       className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                     >
                       İptal
                     </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Ad
                      </label>
                      <p className="text-lg text-gray-800">{userInfo?.first_name || 'Belirtilmemiş'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Soyad
                      </label>
                      <p className="text-lg text-gray-800">{userInfo?.last_name || 'Belirtilmemiş'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        E-posta
                      </label>
                      <p className="text-lg text-gray-800">{userEmail || 'Belirtilmemiş'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Seviye
                      </label>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(userLevel)}`}>
                        {getLevelText(userLevel)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* {activeTab === 'performance' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Performans İstatistikleri</h2>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7e90d0]"></div>
                </div>
              ) : performanceStats ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Toplam Sohbet</p>
                        <p className="text-3xl font-bold">{performanceStats.total_chats || 0}</p>
                      </div>
                      <span className="material-icons text-4xl opacity-80">chat</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Öğrenilen Kelime</p>
                        <p className="text-3xl font-bold">{performanceStats.total_vocabulary || 0}</p>
                      </div>
                      <span className="material-icons text-4xl opacity-80">translate</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Düzeltilen Hata</p>
                        <p className="text-3xl font-bold">{performanceStats.total_grammar_errors || 0}</p>
                      </div>
                      <span className="material-icons text-4xl opacity-80">spellcheck</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="material-icons text-6xl mb-4">analytics</span>
                  <p>Henüz performans verisi bulunmuyor.</p>
                </div>
              )}
            </div>
          )} */}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Hesap Ayarları</h2>
              <div className="space-y-6">
                                 <div className="border border-gray-200 rounded-lg p-4">
                   <h3 className="text-lg font-semibold text-gray-800 mb-2">Şifre Değiştir</h3>
                   <p className="text-gray-600 mb-4">Hesap güvenliğiniz için şifrenizi düzenli olarak değiştirin.</p>
                   <button 
                     onClick={() => setShowPasswordModal(true)}
                     className="px-4 py-2 bg-[#7e90d0] text-white rounded-lg hover:bg-[#6a7bc0] transition-colors"
                   >
                     Şifre Değiştir
                   </button>
                 </div>
                 
                 <div className="border border-gray-200 rounded-lg p-4">
                   <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Değiştir</h3>
                   <p className="text-gray-600 mb-4">Hesap bilgilerinizi güncel tutmak için email adresinizi değiştirin.</p>
                   <button 
                     onClick={() => setShowEmailModal(true)}
                     className="px-4 py-2 bg-[#7e90d0] text-white rounded-lg hover:bg-[#6a7bc0] transition-colors"
                   >
                     Email Değiştir
                   </button>
                 </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Bildirim Ayarları</h3>
                  <p className="text-gray-600 mb-4">E-posta ve uygulama bildirimlerini yönetin.</p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      E-posta bildirimleri
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Günlük hatırlatmalar
                    </label>
                  </div>
                </div>

                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Tehlikeli Bölge</h3>
                  <p className="text-red-600 mb-4">Bu işlemler geri alınamaz.</p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Hesabı Sil
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

         {/* Şifre Değiştirme Modal */}
     {showPasswordModal && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
           <h3 className="text-xl font-bold text-gray-800 mb-4">Şifre Değiştir</h3>
           
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Mevcut Şifre
               </label>
               <input
                 type="password"
                 name="currentPassword"
                 value={passwordData.currentPassword}
                 onChange={handlePasswordChange}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7e90d0] focus:border-transparent"
                 placeholder="Mevcut şifrenizi girin"
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Yeni Şifre
               </label>
               <input
                 type="password"
                 name="newPassword"
                 value={passwordData.newPassword}
                 onChange={handlePasswordChange}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7e90d0] focus:border-transparent"
                 placeholder="Yeni şifrenizi girin"
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Yeni Şifre (Tekrar)
               </label>
               <input
                 type="password"
                 name="confirmPassword"
                 value={passwordData.confirmPassword}
                 onChange={handlePasswordChange}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7e90d0] focus:border-transparent"
                 placeholder="Yeni şifrenizi tekrar girin"
               />
             </div>
             
             {passwordError && (
               <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                 {passwordError}
               </div>
             )}
           </div>
           
           <div className="flex gap-3 mt-6">
             <button
               onClick={handlePasswordUpdate}
               disabled={loading}
               className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
             >
               {loading ? 'Güncelleniyor...' : 'Güncelle'}
             </button>
                            <button
                 onClick={async () => {
                   if (passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword) {
                     const result = await Swal.fire({
                       icon: 'question',
                       title: 'Modal\'ı Kapatmak İstiyor musunuz?',
                       text: 'Girdiğiniz bilgiler kaybolacak.',
                       showCancelButton: true,
                       confirmButtonText: 'Evet, Kapat',
                       cancelButtonText: 'Hayır, Devam Et',
                       confirmButtonColor: '#6b7280',
                       cancelButtonColor: '#7e90d0'
                     });
                     
                     if (result.isConfirmed) {
                       setShowPasswordModal(false);
                       setPasswordData({
                         currentPassword: '',
                         newPassword: '',
                         confirmPassword: ''
                       });
                       setPasswordError('');
                     }
                   } else {
                     setShowPasswordModal(false);
                     setPasswordData({
                       currentPassword: '',
                       newPassword: '',
                       confirmPassword: ''
                     });
                     setPasswordError('');
                   }
                 }}
                 className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
               >
                 İptal
               </button>
           </div>
         </div>
       </div>
     )}

     {/* Email Değiştirme Modal */}
     {showEmailModal && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
           <h3 className="text-xl font-bold text-gray-800 mb-4">Email Değiştir</h3>
           
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Yeni Email Adresi
               </label>
               <input
                 type="email"
                 name="newEmail"
                 value={emailData.newEmail}
                 onChange={handleEmailChange}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7e90d0] focus:border-transparent"
                 placeholder="Yeni email adresinizi girin"
               />
             </div>
             
             {emailError && (
               <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                 {emailError}
               </div>
             )}
           </div>
           
           <div className="flex gap-3 mt-6">
             <button
               onClick={handleEmailUpdate}
               disabled={loading}
               className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
             >
               {loading ? 'Güncelleniyor...' : 'Güncelle'}
             </button>
                            <button
                 onClick={async () => {
                   if (emailData.newEmail) {
                     const result = await Swal.fire({
                       icon: 'question',
                       title: 'Modal\'ı Kapatmak İstiyor musunuz?',
                       text: 'Girdiğiniz email adresi kaybolacak.',
                       showCancelButton: true,
                       confirmButtonText: 'Evet, Kapat',
                       cancelButtonText: 'Hayır, Devam Et',
                       confirmButtonColor: '#6b7280',
                       cancelButtonColor: '#7e90d0'
                     });
                     
                     if (result.isConfirmed) {
                       setShowEmailModal(false);
                       setEmailData({
                         newEmail: ''
                       });
                       setEmailError('');
                     }
                   } else {
                     setShowEmailModal(false);
                     setEmailData({
                       newEmail: ''
                     });
                     setEmailError('');
                   }
                 }}
                 className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
               >
                 İptal
               </button>
           </div>
         </div>
       </div>
     )}
    </>
  );
};

export default Profile; 