import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { HelpModal } from '../components/HelpModal';
import { saveEmergency } from '../../../utils/supabase/emergency';
import { Phone, AlertTriangle, AlertCircle } from 'lucide-react';

const DISCLAIMER_KEY = "emergency_app_disclaimer_accepted";

export default function EmergencyConfirmation() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [showHelp, setShowHelp] = useState(false);
  const [locationData, setLocationData] = useState<{ latitude: number; longitude: number } | null>(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
    return typeof window !== "undefined" && localStorage.getItem(DISCLAIMER_KEY) === "true";
  });

  // Fetch location when disclaimer is accepted (for emergency record)
  useEffect(() => {
    if (!disclaimerAccepted || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocationData({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
    );
  }, [disclaimerAccepted]);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem(DISCLAIMER_KEY, "true");
    setDisclaimerAccepted(true);
  };

  const handleCall = async (number: string) => {
    try {
      const location = locationData
        ? {
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            coordinates: `${locationData.latitude.toFixed(4)}° N, ${locationData.longitude.toFixed(4)}° E`,
            street: `${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)}`,
            province: 'Thailand',
          }
        : undefined;
      await saveEmergency({
        userId: user?.id,
        type: 'emergency',
        selectedNumber: number,
        location,
      });
    } catch (err) {
      console.error(err);
    }
    window.location.href = `tel:${number}`;
  };

  // Disclaimer must be accepted before emergency mode
  if (!disclaimerAccepted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
        <Header title={language === 'en' ? 'Emergency Call' : 'โทรฉุกเฉิน'} showBack={true} />
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-800/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-2">
                  {language === 'en' ? 'Important Notice' : 'ประกาศสำคัญ'}
                </h2>
                <p className="text-amber-900 dark:text-amber-200 text-sm leading-relaxed">
                  {language === 'en'
                    ? 'This app does not replace professional medical or emergency services. In a life-threatening situation, always call local emergency numbers (191, 1669, 1155) immediately.'
                    : 'แอปนี้ไม่สามารถแทนที่บริการทางการแพทย์หรือฉุกเฉินมืออาชีพได้ ในสถานการณ์ที่คุกคามชีวิต โปรดโทรหมายเลขฉุกเฉิน (191, 1669, 1155) ทันที'}
                </p>
              </div>
            </div>
            <button
              onClick={handleAcceptDisclaimer}
              className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-amber-600 dark:border-amber-500 hover:border-amber-700 dark:hover:border-amber-400 active:scale-[0.99] transition-all text-amber-900 dark:text-amber-100 font-semibold"
            >
              {language === 'en' ? 'I Understand – Continue' : 'ฉันเข้าใจ – ดำเนินการต่อ'}
            </button>
          </div>
        </div>
        <BottomNav onHelpClick={() => setShowHelp(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
      <Header 
        title={language === 'en' ? 'Emergency Call' : 'โทรฉุกเฉิน'} 
        showBack={true}
      />
      
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        {/* Warning Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-red-50 dark:bg-red-900/30 p-8 rounded-full">
            <AlertTriangle className="w-16 h-16 text-[#DC2626]" />
          </div>
        </div>

        {/* Confirmation Text */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-[var(--foreground)] mb-3">
            {language === 'en' 
              ? 'Emergency call in Thailand' 
              : 'โทรฉุกเฉินในประเทศไทย'}
          </h2>
          <p className="text-gray-600 dark:text-[var(--muted-foreground)] text-base max-w-sm mx-auto">
            {language === 'en'
              ? 'You will be connected to emergency services immediately'
              : 'คุณจะเชื่อมต่อกับหน่วยบริการฉุกเฉินทันที'}
          </p>
        </div>

        {/* Primary Emergency Button - 191 */}
        <button
          onClick={() => handleCall('191')}
          className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-[#DC2626] hover:border-[#B91C1C] dark:border-[#DC2626] dark:hover:border-[#ef4444] active:scale-[0.99] transition-all mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#DC2626] p-4 rounded-xl">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--foreground)] mb-1">
                {language === 'en' ? 'Call Police (191) Now' : 'โทรตำรวจ (191) ตอนนี้'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)]">
                {language === 'en' ? 'Immediate danger' : 'อันตรายทันที'}
              </p>
            </div>
            <span className="text-2xl font-bold text-[#DC2626]">191</span>
          </div>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-300 dark:bg-[var(--border)]"></div>
          <span className="text-sm text-gray-500 dark:text-[var(--muted-foreground)]">
            {language === 'en' ? 'or' : 'หรือ'}
          </span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-[var(--border)]"></div>
        </div>

        {/* Secondary Options */}
        <div className="space-y-4">
          <button
            onClick={() => handleCall('1669')}
            className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 dark:bg-[var(--secondary)] p-4 rounded-xl">
                <span className="text-2xl">🚑</span>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-[var(--foreground)] mb-1">
                  {language === 'en' ? 'Call Ambulance' : 'โทรรถพยาบาล'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)]">
                  {language === 'en' ? 'Medical Emergency' : 'ฉุกเฉินทางการแพทย์'}
                </p>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-[var(--foreground)]">1669</span>
            </div>
          </button>

          <button
            onClick={() => handleCall('1155')}
            className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 dark:bg-[var(--secondary)] p-4 rounded-xl">
                <span className="text-2xl">🛂</span>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-[var(--foreground)] mb-1">
                  {language === 'en' ? 'Call Tourist Police' : 'โทรตำรวจท่องเที่ยว'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)]">
                  {language === 'en' ? 'For Tourists' : 'สำหรับนักท่องเที่ยว'}
                </p>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-[var(--foreground)]">1155</span>
            </div>
          </button>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 dark:text-[var(--muted-foreground)] mt-6">
          {language === 'en' 
            ? 'Use Tourist Police if you need English support.' 
            : 'ใช้ตำรวจท่องเที่ยวหากคุณต้องการการสนับสนุนภาษาอังกฤษ'}
        </p>
      </div>
      
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <BottomNav onHelpClick={() => setShowHelp(true)} />
    </div>
  );
}
