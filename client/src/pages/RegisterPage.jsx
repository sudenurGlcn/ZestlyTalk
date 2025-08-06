import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RegisterForm from "../components/Register/RegisterForm.jsx";
import { registerUserAsync, selectIsLoading, selectAuthError, clearError } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state'lerini al
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);

  // Error temizleme
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Error handling
  useEffect(() => {
    if (error) {
      let errorTitle = "Kayıt Başarısız!";
      let errorText = "Kayıt sırasında bir hata oluştu.<br><br>Lütfen bilgilerinizi kontrol edip tekrar deneyiniz.";
      
      // Email zaten kayıtlı durumu için özel mesaj
      if (error.includes("Email zaten kayıtlı")) {
        errorTitle = "Email Zaten Kayıtlı!";
        errorText = "Bu email adresi zaten kullanımda.<br><br>Lütfen farklı bir email adresi ile kayıt olun<br>veya giriş yapın.";
      }
      
      Swal.fire({
        title: errorTitle,
        html: errorText,
        icon: "error",
        confirmButtonText: "Tamam",
        confirmButtonColor: "#7e90d0",
        showCloseButton: true,
        customClass: {
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600 leading-relaxed',
          confirmButton: 'px-6 py-2 rounded-lg font-semibold'
        }
      });
    }
  }, [error]);

  const handleRegister = async (formData) => {
    try {
      await dispatch(registerUserAsync(formData)).unwrap();
      
      // Başarılı kayıt durumunda SweetAlert göster
      Swal.fire({
        title: "Kayıt Başarılı!",
        html: "Hesabınız başarıyla oluşturuldu.<br><br>Giriş sayfasına yönlendiriliyorsunuz...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
        customClass: {
          title: 'text-xl font-bold text-gray-800',
          htmlContainer: 'text-gray-600 leading-relaxed'
        }
      }).then(() => {
        navigate("/login");
      });
      
    } catch (err) {
      // Error zaten useEffect'te handle ediliyor
    }
  };
  return (
    <div>
      
      <RegisterForm onSubmit={handleRegister} />
      {isLoading && <p>Yükleniyor...</p>}
    </div>
  );
}
