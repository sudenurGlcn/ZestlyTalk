import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, selectIsAuthenticated, selectIsLoading, selectAuthError, clearError } from "../store/authSlice";
import { fetchCurrentUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import LoginYatay from "../assets/LoginEkranıSon.png";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state'lerini al
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    if (isAuthenticated) {
      // Login başarılı olduktan sonra kullanıcı bilgilerini getir
      dispatch(fetchCurrentUser());
      navigate("/"); // Kullanıcı giriş yaptıysa anasayfaya yönlendir
    }
  }, [isAuthenticated, navigate, dispatch]);

  // Error temizleme
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{
        backgroundImage: `url(${LoginYatay})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Arka plan overlay */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Ana kart */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Login</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all"
              placeholder="Email"
            />
          </div>
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all"
              placeholder="Password"
            />
            <button 
              type="button" 
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#7e90d0] text-white font-semibold text-lg py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Giriş yapılıyor..." : "Log In"}
          </button>

          {error && (
            <p className="text-red-500 text-center text-sm">{error}</p>
          )}
        </form>

        {/* Alt linkler */}
        <div className="mt-6 space-y-2 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-[#e57697] hover:text-[#7e90d0] font-semibold">
              Register.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
