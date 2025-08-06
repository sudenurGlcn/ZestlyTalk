import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { clearUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { clearMessages } from '../store/scenarioSlice';
import { clearChatMessages } from '../store/chatHistorySlice';

const LogoutButton = ({ className = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Redux state'lerini temizle
    dispatch(logout());
    dispatch(clearUser());
    dispatch(clearMessages());
    dispatch(clearChatMessages());

    // LocalStorage'dan tüm state'leri temizle
    localStorage.removeItem('scenarioState');
    localStorage.removeItem('chatHistoryState');
    localStorage.removeItem('authState');
    localStorage.removeItem('userState');
    localStorage.removeItem('forceNewChat');

    // Diğer tüm state'leri temizle
    localStorage.clear(); // Tüm localStorage'ı temizle

    // Login sayfasına yönlendir
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-semibold hover:bg-[#b4e3fd] hover:text-white transition duration-200">
                <span className="material-icons text-xl">logout</span>
      Çıkış Yap
    </button>
 
  );
};

export default LogoutButton; 