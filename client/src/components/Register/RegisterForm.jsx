import { useState } from "react";
import Background from "../../assets/GrafikBackground.png";


const LEVELS = [
  { key: "A1", label: "A1" },
  { key: "A2", label: "A2" },
  { key: "B1", label: "B1" },
  { key: "B2", label: "B2" },
  { key: "C1", label: "C1" },
  { key: "C2", label: "C2" },
  { key: "blank", label: "I don't know my level" },
];

export default function RegisterForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    level: "",
    native_language: "Turkish",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLevelSelect = (level) => {
    setFormData((prev) => ({ ...prev, level }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // "I don't know my level" seçildiğinde null gönder
    const submitData = {
      ...formData,
      level: formData.level === 'blank' ? null : formData.level
    };
    
    onSubmit(submitData);
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen px-2"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 flex flex-col gap-6 border border-[#e3ecfa]"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-left">Register</h2>
        <input
          type="text"
          name="first_name"
          placeholder="Name"
          value={formData.first_name}
          onChange={handleChange}
          required
          pattern="[a-zA-ZğüşıöçĞÜŞİÖÇ\s]*"
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, "");
          }}
          className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b4e3fd] transition bg-white placeholder-gray-400 text-base"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Surname"
          value={formData.last_name}
          onChange={handleChange}
          required
          pattern="[a-zA-ZğüşıöçĞÜŞİÖÇ\s]*"
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, "");
          }}
          className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b4e3fd] transition bg-white placeholder-gray-400 text-base"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b4e3fd] transition bg-white placeholder-gray-400 text-base"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b4e3fd] transition bg-white placeholder-gray-400 text-base"
        />
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-3">Choice Level</label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {LEVELS.map((level) => (
              <button
                type="button"
                key={level.key}
                onClick={() => handleLevelSelect(level.key)}
                className={`h-12 px-4 rounded-xl font-semibold text-sm shadow-sm border transition-all duration-200 flex items-center justify-center
                  ${formData.level === level.key
                    ? "bg-[#b4e3fd] text-white border-[#b4e3fd] scale-105 shadow-md"
                    : "bg-[#f5f7fa] text-gray-700 border-gray-200 hover:bg-[#e3ecfa] hover:border-[#b4e3fd]"}
                `}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-2 py-3 rounded-xl bg-[#7e90d0] text-white font-semibold text-lg shadow-md transition-all duration-200 hover:bg-[#b4e3fd] hover:text-[#7e90d0]"
        >
          Register
        </button>
        
        {/* Login sayfasına yönlendiren link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Zaten hesabınız var mı?{" "}
            <a href="/login" className="text-[#e57697] hover:text-[#7e90d0] font-semibold">
              Giriş yapın.
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
