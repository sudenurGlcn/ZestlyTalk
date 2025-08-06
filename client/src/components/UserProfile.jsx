import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../store/authSlice';
import LogoutButton from './LogoutButton';

const UserProfile = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  // Kullanıcı bilgilerini authSlice'dan al
  const userInfo = user;
  const userName = user ? `${user.first_name} ${user.last_name}` : '';
  const userLevel = user?.level || '';
  const userEmail = user?.email || '';

  if (!isAuthenticated) {
    return <div>Lütfen giriş yapın</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Kullanıcı Profili</h2>
      <div className="space-y-2">
        <p><strong>Ad Soyad:</strong> {userName || 'Belirtilmemiş'}</p>
        <p><strong>E-posta:</strong> {userEmail || 'Belirtilmemiş'}</p>
        <p><strong>Seviye:</strong> {userLevel || 'Belirtilmemiş'}</p>
        <p><strong>ID:</strong> {userInfo.id || 'Belirtilmemiş'}</p>
      </div>
      <div className="mt-4">
        <LogoutButton />
      </div>
    </div>
  );
};

export default UserProfile; 