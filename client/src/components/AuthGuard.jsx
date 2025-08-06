import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { selectIsAuthenticated } from '../store/authSlice';
import { fetchCurrentUser, selectUserInfo } from '../store/userSlice';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userInfo = useSelector(selectUserInfo);

  useEffect(() => {
    // Eğer authenticate olmuş ama user bilgileri yoksa getir
    if (isAuthenticated && !userInfo.id) {
      dispatch(fetchCurrentUser());
    }
  }, [isAuthenticated, userInfo.id, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard; 