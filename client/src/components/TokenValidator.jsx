import { useTokenValidation } from '../hooks/useTokenValidation';

const TokenValidator = () => {
  // Token geçerliliğini kontrol et
  useTokenValidation();
  return null;
};

export default TokenValidator; 