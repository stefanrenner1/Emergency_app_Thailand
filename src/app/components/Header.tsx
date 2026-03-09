import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, User } from 'lucide-react';
import { ProfileMenu } from './ProfileMenu';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function Header({ title, showBack = true, onBack }: HeaderProps) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user } = useAuth();
  const isLoggedIn = !!user;
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };
  
  return (
    <>
      <div className="sticky top-0 z-50 bg-white dark:bg-[var(--card)] border-b border-gray-200 dark:border-[var(--border)] shadow-sm shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back Button */}
          <div className="w-10">
            {showBack && (
              <button
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-[var(--secondary)] hover:bg-gray-200 dark:hover:bg-[var(--accent)] active:scale-95 transition-all"
                aria-label="Go back"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-[var(--muted-foreground)]" />
              </button>
            )}
          </div>
          
          {/* Center: Title */}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-[var(--foreground)] text-center flex-1 px-2 truncate">
            {title}
          </h1>
          
          {/* Right: Profile Icon */}
          <div className="w-10">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                isLoggedIn 
                  ? 'bg-gray-900 dark:bg-[var(--foreground)] hover:bg-gray-800 dark:hover:bg-[var(--muted-foreground)]' 
                  : 'bg-gray-100 dark:bg-[var(--secondary)] hover:bg-gray-200 dark:hover:bg-[var(--accent)] border-2 border-gray-300 dark:border-[var(--border)]'
              }`}
              aria-label="Profile menu"
            >
              <User className={`w-5 h-5 ${isLoggedIn ? 'text-white dark:text-[var(--background)]' : 'text-gray-600 dark:text-[var(--muted-foreground)]'}`} />
            </button>
          </div>
        </div>
      </div>
      
      <ProfileMenu 
        isOpen={showProfileMenu} 
        onClose={() => setShowProfileMenu(false)}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}