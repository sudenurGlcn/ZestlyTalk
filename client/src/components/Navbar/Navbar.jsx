import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../LogoutButton.jsx';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/authSlice.js';

function Navbar() {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUser);

  const navItems = [
    { name: 'Anasayfa', path: '/', icon: 'home' },
    { name: 'Yeni Sohbet', path: '/new-chat', icon: 'chat' },
    { name: 'Senaryolar', path: '/scenarios', icon: 'theater_comedy' },
    { name: 'Sohbet Geçmişi', path: '/chat-history', icon: 'history' },
    { name: 'Grafikler', path: '/progress-report', icon: 'bar_chart' },
    { name: 'Testler', path: '/tests', icon: 'quiz' }
  ];

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
          {/* Navbar */}
      <header className="w-full flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-sm shadow-sm border-b border-white/20">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-all duration-200"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] rounded-xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">Z</span>
          </div>
          <span className="text-2xl font-bold text-gray-800 tracking-wide">ZestlyTalk</span>
        </div>

        {/* Navigasyon Menüsü */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-[#b4e3fd] hover:text-white transition duration-200"
            >
              <span className="material-icons text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Profil Butonu */}
        <div className="relative" ref={profileRef}>
          <button
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 hover:bg-white transition duration-300 shadow-sm"
            onClick={() => setProfileMenuOpen((v) => !v)}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-[#7e90d0] to-[#b4e3fd] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {userInfo?.first_name?.charAt(0) || 'U'}
              </span>
            </div>
            <span className="text-gray-700 font-semibold">{userInfo?.first_name || 'Kullanıcı'}</span>
            <span className="material-icons text-gray-500">expand_more</span>
          </button>
          
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 z-50 flex flex-col py-2">
              <button 
                onClick={() => {
                  navigate('/profile');
                  setProfileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-semibold hover:bg-[#b4e3fd] hover:text-white transition duration-200"
              >
                <span className="material-icons text-xl">person</span>
                Profil
              </button>
              <LogoutButton />
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

export default Navbar