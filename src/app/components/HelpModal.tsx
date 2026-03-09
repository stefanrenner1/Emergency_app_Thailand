import React, { useState } from 'react';
import { X, Phone, Bug } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { submitBugReport } from '../../../utils/supabase/bugReport';
import { saveEmergency } from '../../../utils/supabase/emergency';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [bugMessage, setBugMessage] = useState('');
  const [bugSubmitting, setBugSubmitting] = useState(false);
  const [bugSent, setBugSent] = useState(false);

  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugMessage.trim()) return;
    setBugSubmitting(true);
    try {
      await submitBugReport(bugMessage.trim(), user?.id);
      setBugMessage('');
      setBugSent(true);
      setTimeout(() => setBugSent(false), 3000);
    } catch (err) {
      console.error(err);
      alert(language === 'en' ? 'Failed to send bug report.' : 'ส่งรายงานข้อบกพร่องไม่สำเร็จ');
    } finally {
      setBugSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  const emergencyServices = [
    {
      name: language === 'en' ? 'Police' : 'ตำรวจ',
      number: '191',
      icon: '🚓',
      color: 'blue',
    },
    {
      name: language === 'en' ? 'Ambulance / Medical Emergency' : 'รถพยาบาล / ฉุกเฉินทางการแพทย์',
      number: '1669',
      icon: '🚑',
      color: 'red',
    },
    {
      name: language === 'en' ? 'Tourist Police' : 'ตำรวจท่องเที่ยว',
      number: '1155',
      icon: '🛂',
      color: 'green',
    },
  ];
  
  const handleCall = async (number: string) => {
    try {
      await saveEmergency({
        userId: user?.id,
        type: 'emergency',
        selectedNumber: number,
      });
    } catch (err) {
      console.error(err);
    }
    window.location.href = `tel:${number}`;
  };
  
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[var(--card)] rounded-t-3xl w-full max-w-md shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[var(--border)]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[var(--foreground)]">
            {language === 'en' ? 'Emergency Numbers' : 'หมายเลขฉุกเฉิน'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-[var(--secondary)] hover:bg-gray-200 dark:hover:bg-[var(--accent)] active:scale-95 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-[var(--muted-foreground)]" />
          </button>
        </div>
        
        {/* Content */}
        <div className="px-6 py-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {/* Warning */}
          <div className="bg-gray-100 dark:bg-[var(--secondary)] border border-gray-300 dark:border-[var(--border)] rounded-xl p-4">
            <p className="text-gray-700 dark:text-[var(--muted-foreground)] text-sm font-medium text-center">
              ⚠️ {language === 'en' 
                ? 'If you are in immediate danger, call 191 now.' 
                : 'หากคุณอยู่ในอันตรายทันที โทร 191 ตอนนี้'}
            </p>
          </div>
          
          {/* Emergency Service Cards */}
          {emergencyServices.map((service, index) => (
            <button
              key={index}
              onClick={() => handleCall(service.number)}
              className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{service.icon}</div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-600 dark:text-[var(--muted-foreground)] mb-1">
                    {service.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-[var(--foreground)]">
                    {service.number}
                  </p>
                </div>
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}

          {/* Bug Report */}
          <div className="border-t border-gray-200 dark:border-[var(--border)] pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[var(--foreground)] mb-2 flex items-center gap-2">
              <Bug className="w-4 h-4" />
              {language === 'en' ? 'Report a Bug' : 'รายงานข้อบกพร่อง'}
            </h3>
            <form onSubmit={handleBugSubmit} className="space-y-2">
              <textarea
                value={bugMessage}
                onChange={(e) => setBugMessage(e.target.value)}
                placeholder={language === 'en' ? 'Describe the issue...' : 'อธิบายปัญหาที่พบ...'}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-[var(--border)] rounded-xl focus:border-gray-900 dark:focus:border-[var(--muted-foreground)] focus:outline-none transition-colors resize-none text-sm bg-white dark:bg-[var(--secondary)] text-gray-900 dark:text-[var(--foreground)] placeholder-gray-500 dark:placeholder-[var(--muted-foreground)]"
                disabled={bugSubmitting}
              />
              <button
                type="submit"
                disabled={bugSubmitting || !bugMessage.trim()}
                className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-4 shadow-sm border-2 border-orange-500 dark:border-orange-500 hover:border-orange-600 dark:hover:border-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-orange-700 dark:text-orange-300 font-medium transition-colors flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {bugSubmitting
                  ? (language === 'en' ? 'Sending...' : 'กำลังส่ง...')
                  : bugSent
                    ? (language === 'en' ? '✓ Sent' : '✓ ส่งแล้ว')
                    : (language === 'en' ? 'Send Bug Report' : 'ส่งรายงาน')}
              </button>
            </form>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-[var(--border)]">
          <button
            onClick={onClose}
            className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-4 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all text-gray-700 dark:text-[var(--muted-foreground)] font-medium"
          >
            {language === 'en' ? 'Close' : 'ปิด'}
          </button>
        </div>
      </div>
    </div>
  );
}