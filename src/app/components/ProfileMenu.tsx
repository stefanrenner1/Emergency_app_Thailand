import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { FileText, LogOut, LogIn, UserPlus, Globe, Info, Edit, Moon, Sun } from 'lucide-react';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
}

export function ProfileMenu({ isOpen, onClose, isLoggedIn }: ProfileMenuProps) {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      const profileData = localStorage.getItem('userProfile');
      if (profileData) {
        const profile = JSON.parse(profileData);
        setUserName(profile.fullName || user?.email || '');
      } else {
        setUserName(user?.email || '');
      }
    }
  }, [isLoggedIn, isOpen, user?.email]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userId');
    onClose();
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'th' : 'en');
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}></div>
      
      {/* Menu Panel */}
      <div 
        ref={menuRef}
        className="fixed top-16 right-4 z-50 w-72 bg-white dark:bg-[var(--card)] rounded-2xl shadow-2xl border border-gray-200 dark:border-[var(--border)] animate-slide-down"
      >
        {isLoggedIn ? (
          /* Logged In Menu */
          <div className="py-2">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-[var(--border)]">
              <p className="text-sm font-semibold text-gray-900 dark:text-[var(--foreground)]">
                {language === 'en' ? 'Account' : 'บัญชี'}
              </p>
              <p className="text-xs text-gray-600 dark:text-[var(--muted-foreground)] mt-0.5">
                {language === 'en' ? 'Welcome, ' + userName : 'ยินดีต้อนรับ, ' + userName}
              </p>
            </div>
            
            <button
              onClick={() => handleNavigate('/important-details')}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[var(--secondary)] transition-colors text-left"
            >
              <FileText className="w-5 h-5 text-gray-600 dark:text-[var(--muted-foreground)]" />
              <span className="text-sm font-medium text-gray-900 dark:text-[var(--foreground)]">
                {language === 'en' ? 'View Important Details' : 'ดูรายละเอียดสำคัญ'}
              </span>
            </button>
            
            <button
              onClick={() => handleNavigate('/profile')}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[var(--secondary)] transition-colors text-left"
            >
              <Edit className="w-5 h-5 text-gray-600 dark:text-[var(--muted-foreground)]" />
              <span className="text-sm font-medium text-gray-900 dark:text-[var(--foreground)]">
                {language === 'en' ? 'Edit Profile' : 'แก้ไขโปรไฟล์'}
              </span>
            </button>
            
            <div className="h-px bg-gray-200 my-2"></div>
            
            <button
              onClick={toggleLanguage}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[var(--secondary)] transition-colors text-left"
            >
              <Globe className="w-5 h-5 text-gray-600 dark:text-[var(--muted-foreground)]" />
              <span className="text-sm font-medium text-gray-900 dark:text-[var(--foreground)]">
                {language === 'en' ? 'Language' : 'ภาษา'}: {language === 'en' ? 'English' : 'ภาษาไทย'}
              </span>
            </button>
            
            <button
              onClick={toggleTheme}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[var(--secondary)] transition-colors text-left"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-[var(--muted-foreground)]" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-[var(--muted-foreground)]" />
              )}
              <span className="text-sm font-medium text-gray-900 dark:text-[var(--foreground)]">
                {language === 'en' ? (isDark ? 'Light Mode' : 'Dark Mode') : (isDark ? 'โหมดสว่าง' : 'โหมดมืด')}
              </span>
            </button>
            
            <div className="h-px bg-gray-200 dark:bg-[var(--border)] my-2"></div>
            
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-left"
            >
              <LogOut className="w-5 h-5 text-[#DC2626]" />
              <span className="text-sm font-medium text-[#DC2626]">
                {language === 'en' ? 'Logout' : 'ออกจากระบบ'}
              </span>
            </button>
          </div>
        ) : (
          /* Not Logged In Menu */
          <div className="py-2">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-[var(--border)]">
              <p className="text-sm font-semibold text-gray-900 dark:text-[var(--foreground)]">
                {language === 'en' ? 'Guest Mode' : 'โหมดผู้เยี่ยมชม'}
              </p>
              <p className="text-xs text-gray-600 dark:text-[var(--muted-foreground)] mt-0.5">
                {language === 'en' ? 'Create a profile to save your details' : 'สร้างโปรไฟล์เพื่อบันทึกรายละเอียดของคุณ'}
              </p>
            </div>
            
            <button
              onClick={() => handleNavigate('/login')}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[var(--secondary)] transition-colors text-left"
            >
              <LogIn className="w-5 h-5 text-gray-600 dark:text-[var(--muted-foreground)]" />
              <span className="text-sm font-medium text-gray-900 dark:text-[var(--foreground)]">
                {language === 'en' ? 'Login' : 'เข้าสู่ระบบ'}
              </span>
            </button>
            
            <button
              onClick={() => handleNavigate('/register')}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[var(--secondary)] transition-colors text-left"
            >
              <UserPlus className="w-5 h-5 text-gray-600 dark:text-[var(--muted-foreground)]" />
              <span className="text-sm font-medium text-gray-900 dark:text-[var(--foreground)]">
                {language === 'en' ? 'Register' : 'สมัครสมาชิก'}
              </span>
            </button>
            
            <div className="h-px bg-gray-200 my-2"></div>
            
            <button
              onClick={toggleLanguage}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[var(--secondary)] transition-colors text-left"
            >
              <Globe className="w-5 h-5 text-gray-600 dark:text-[var(--muted-foreground)]" />
              <span className="text-sm font-medium text-gray-900 dark:text-[var(--foreground)]">
                {language === 'en' ? 'Language' : 'ภาษา'}: {language === 'en' ? 'English' : 'ภาษาไทย'}
              </span>
            </button>
            
            <button
              onClick={toggleTheme}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[var(--secondary)] transition-colors text-left"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-[var(--muted-foreground)]" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-[var(--muted-foreground)]" />
              )}
              <span className="text-sm font-medium text-gray-900 dark:text-[var(--foreground)]">
                {language === 'en' ? (isDark ? 'Light Mode' : 'Dark Mode') : (isDark ? 'โหมดสว่าง' : 'โหมดมืด')}
              </span>
            </button>
            
            <div className="h-px bg-gray-200 dark:bg-[var(--border)] my-2"></div>
            
            <button
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[var(--secondary)] transition-colors text-left"
              onClick={onClose}
            >
              <Info className="w-5 h-5 text-gray-600 dark:text-[var(--muted-foreground)]" />
              <span className="text-sm font-medium text-gray-900">
                {language === 'en' ? 'About / Info' : 'เกี่ยวกับ'}
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}