import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccessToken, logout } from '../store/authSlice.js';
import { clearUser } from '../store/userSlice.js';
import { isTokenValid } from '../utils/tokenUtils.js';

export const useTokenValidation = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    // Token geçerliliğini kontrol et
    if (accessToken && !isTokenValid(accessToken)) {
      
      dispatch(logout());
      dispatch(clearUser());
    }
  }, [accessToken, dispatch]);

  return {
    isTokenValid: accessToken ? isTokenValid(accessToken) : false,
    accessToken
  };
}; 