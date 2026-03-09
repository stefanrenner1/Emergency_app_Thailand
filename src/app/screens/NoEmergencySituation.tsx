import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { HelpModal } from '../components/HelpModal';
import { Heart, Car, HelpCircle, AlertCircle, ChevronRight, FileQuestion } from 'lucide-react';

export default function NoEmergencySituation() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [showHelp, setShowHelp] = useState(false);

  const situations = [
    {
      key: 'medical',
      icon: Heart,
      labelEn: 'Minor Medical Issue',
      labelTh: 'ปัญหาทางการแพทย์เล็กน้อย',
      descEn: 'Minor injury or illness, not critical',
      descTh: 'บาดเจ็บหรือเจ็บป่วยเล็กน้อย ไม่วิกฤต',
    },
    {
      key: 'breakdown',
      icon: Car,
      labelEn: 'Vehicle Breakdown',
      labelTh: 'รถเสีย',
      descEn: 'Vehicle issue, need roadside help',
      descTh: 'ปัญหารถยนต์ ต้องการความช่วยเหลือข้างทาง',
    },
    {
      key: 'assistance',
      icon: HelpCircle,
      labelEn: 'Lost / Need Assistance',
      labelTh: 'หลงทาง / ต้องการความช่วยเหลือ',
      descEn: 'Lost, confused, need guidance',
      descTh: 'หลงทาง สับสน ต้องการคำแนะนำ',
    },
    {
      key: 'lost_passport',
      icon: FileQuestion,
      labelEn: 'Lost Passport / Documents',
      labelTh: 'สูญหายพาสปอร์ต / เอกสาร',
      descEn: 'Lost passport or travel documents',
      descTh: 'สูญหายพาสปอร์ตหรือเอกสารเดินทาง',
    },
    {
      key: 'other',
      icon: AlertCircle,
      labelEn: 'Other',
      labelTh: 'อื่นๆ',
      descEn: 'Other non-emergency situation',
      descTh: 'สถานการณ์อื่นๆ ที่ไม่ฉุกเฉิน',
    },
  ];

  const handleSelect = (situationKey: string) => {
    localStorage.setItem('noEmergencySituation', situationKey);
    navigate('/no-emergency-questions');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
      <Header 
        title={language === 'en' ? 'Select Situation' : 'เลือกสถานการณ์'} 
      />
      
        <div className="flex-1 px-6 py-6 space-y-4">
        {/* Info Box */}
        <div className="bg-gray-100 dark:bg-[var(--secondary)] border border-gray-300 dark:border-[var(--border)] rounded-xl p-4 mb-4">
          <p className="text-gray-700 dark:text-[var(--muted-foreground)] text-sm text-center leading-relaxed">
            ⚠️ {language === 'en' 
              ? 'For life-threatening emergencies, call 191 or 1669 immediately' 
              : 'สำหรับเหตุฉุกเฉินที่คุกคามชีวิต โทร 191 หรือ 1669 ทันที'}
          </p>
        </div>

        {situations.map((situation, index) => {
          const Icon = situation.icon;
          return (
            <button
              key={index}
              onClick={() => handleSelect(situation.key)}
              className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-200 dark:bg-[var(--secondary)] p-4 rounded-xl">
                  <Icon className="w-7 h-7 text-gray-700 dark:text-[var(--muted-foreground)]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-[var(--foreground)] mb-1">
                    {language === 'en' ? situation.labelEn : situation.labelTh}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)]">
                    {language === 'en' ? situation.descEn : situation.descTh}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-[var(--muted-foreground)]" />
              </div>
            </button>
          );
        })}
      </div>
      
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <BottomNav onHelpClick={() => setShowHelp(true)} />
    </div>
  );
}
