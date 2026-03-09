import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, HelpCircle, FileText, Shield, AlertTriangle } from 'lucide-react';
import { HelpModal } from '../components/HelpModal';
import { BottomNav } from '../components/BottomNav';
import { Header } from '../components/Header';

export default function Landing() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [showHelp, setShowHelp] = useState(false);
  const [locationText, setLocationText] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationText(
        language === 'en'
          ? 'Location not supported on this device'
          : 'อุปกรณ์นี้ไม่รองรับการระบุตำแหน่ง',
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationText(
          language === 'en'
            ? `Your location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            : `ตำแหน่งของคุณ: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        );
      },
      () => {
        setLocationText(
          language === 'en'
            ? 'Location access denied'
            : 'ไม่สามารถเข้าถึงตำแหน่งได้',
        );
      },
    );
  }, [language]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
      {/* Header with Profile Icon */}
      <Header 
        title={language === 'en' ? 'Thailand Emergency Assistant' : 'ผู้ช่วยฉุกเฉินประเทศไทย'}
        showBack={false}
      />

      {/* Subtitle */}
      <div className="px-6 pt-6 pb-4 text-center">
        <p className="text-gray-600 dark:text-[var(--muted-foreground)] text-base font-medium">
          {language === 'en' ? 'Fast help. Clear communication.' : 'ช่วยเหลือรวดเร็ว สื่อสารชัดเจน'}
        </p>
        {!user && (
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            {language === 'en' ? 'Guest mode available' : 'โหมดผู้เยี่ยมชมพร้อมใช้งาน'}
          </p>
        )}
        {locationText && (
          <p className="text-xs text-gray-500 dark:text-[var(--muted-foreground)] mt-2">
            {locationText}
          </p>
        )}
      </div>

      {/* Main Content - Three Tiles */}
      <div className="flex-1 px-6 py-4 space-y-4">
        {/* Emergency Tile */}
        <button
          onClick={() => navigate('/emergency-confirmation')}
          className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-[#DC2626] dark:hover:border-[var(--dm-emergency-red)] active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#DC2626] p-4 rounded-xl">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--foreground)] mb-1">
                {language === 'en' ? 'Emergency' : 'ฉุกเฉิน'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)]">
                {language === 'en' ? 'Immediate danger or medical crisis' : 'อันตรายทันทีหรือวิกฤตทางการแพทย์'}
              </p>
            </div>
          </div>
        </button>

        {/* No Emergency Tile */}
        <button
          onClick={() => navigate('/no-emergency-situation')}
          className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 dark:bg-[var(--secondary)] p-4 rounded-xl">
              <HelpCircle className="w-8 h-8 text-gray-700 dark:text-gray-200" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--foreground)] mb-1">
                {language === 'en' ? 'No Emergency' : 'ไม่ฉุกเฉิน'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)]">
                {language === 'en' ? 'Need help but safe for now' : 'ต้องการความช่วยเหลือแต่ปลอดภัยในขณะนี้'}
              </p>
            </div>
          </div>
        </button>

        {/* Important Details Tile */}
        <button
          onClick={() => navigate('/important-details')}
          className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 dark:bg-[var(--secondary)] p-4 rounded-xl">
              <FileText className="w-8 h-8 text-gray-700 dark:text-gray-200" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--foreground)] mb-1">
                {language === 'en' ? 'Important Details' : 'รายละเอียดสำคัญ'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)]">
                {language === 'en' ? 'View your saved information' : 'ดูข้อมูลที่บันทึกไว้'}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Policy Links */}
      <div className="px-6 py-6 border-t border-gray-200 dark:border-[var(--border)] bg-white/50 dark:bg-[var(--muted)]/30">
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/privacy"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[var(--secondary)] hover:bg-gray-200 dark:hover:bg-[var(--accent)] text-gray-700 dark:text-[var(--muted-foreground)] text-sm font-medium transition-colors"
          >
            <Shield className="w-4 h-4" />
            {language === 'en' ? 'Privacy Policy' : 'นโยบายความเป็นส่วนตัว'}
          </Link>
          <Link
            to="/disclaimer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[var(--secondary)] hover:bg-gray-200 dark:hover:bg-[var(--accent)] text-gray-700 dark:text-[var(--muted-foreground)] text-sm font-medium transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            {language === 'en' ? 'Disclaimer' : 'ข้อจำกัดความรับผิดชอบ'}
          </Link>
        </div>
      </div>
      
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <BottomNav onHelpClick={() => setShowHelp(true)} showBack={false} />
    </div>
  );
}