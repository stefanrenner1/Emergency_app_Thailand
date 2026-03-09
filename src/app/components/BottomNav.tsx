import React from 'react';
import { useNavigate } from 'react-router';
import { Home, ChevronLeft, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavProps {
  onHelpClick: () => void;
  showBack?: boolean;
}

export function BottomNav({ onHelpClick, showBack = true }: BottomNavProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleHome = () => {
    navigate('/');
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[var(--card)] border-t border-gray-200 dark:border-[var(--border)] shadow-lg">
      <div className="flex items-center justify-around px-4 py-3 max-w-md mx-auto">
        {/* Home Button */}
        <button
          onClick={handleHome}
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[var(--secondary)] active:scale-95 transition-all"
          aria-label="Home"
        >
          <Home className="w-6 h-6 text-gray-700 dark:text-[var(--muted-foreground)]" />
          <span className="text-xs font-medium text-gray-600 dark:text-[var(--muted-foreground)]">Home</span>
        </button>
        
        {/* Back Button */}
        {showBack && (
          <button
            onClick={handleBack}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[var(--secondary)] active:scale-95 transition-all"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-[var(--muted-foreground)]" />
            <span className="text-xs font-medium text-gray-600 dark:text-[var(--muted-foreground)]">{t('back')}</span>
          </button>
        )}
        
        {/* Help Button */}
        <button
          onClick={onHelpClick}
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[var(--secondary)] active:scale-95 transition-all"
          aria-label="Help"
        >
          <HelpCircle className="w-6 h-6 text-[#DC2626]" />
          <span className="text-xs font-medium text-[#DC2626]">Help</span>
        </button>
      </div>
    </div>
  );
}
