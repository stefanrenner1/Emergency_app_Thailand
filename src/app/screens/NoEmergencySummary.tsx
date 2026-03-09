import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { HelpModal } from '../components/HelpModal';
import { saveEmergency } from '../../../utils/supabase/emergency';
import { getFacilityTypeForSituation } from '../../../utils/nearbyPlaces';
import { MessageSquare, CheckCircle, Edit2 } from 'lucide-react';

// Human-readable labels for answer keys (for message display)
const ANSWER_LABELS_EN: Record<string, string> = {
  symptoms: 'Symptoms',
  symptomDuration: 'Duration of symptoms',
  allergies: 'Allergies',
  regularMedication: 'Regular medications',
  injured: 'Someone injured',
  needEnglish: 'Need English help',
  vehicleType: 'Vehicle type',
  problem: 'Problem',
  blockingTraffic: 'Blocking traffic',
  passengers: 'Number of people',
  hasCopy: 'Has passport copy',
  whenLost: 'When lost',
  hasOtherId: 'Has other ID',
  situationType: 'Type of request',
  alone: 'Alone or with others',
  immediateDanger: 'Immediate danger',
};
const ANSWER_LABELS_TH: Record<string, string> = {
  symptoms: 'อาการ',
  symptomDuration: 'ระยะเวลาอาการ',
  allergies: 'อาการแพ้',
  regularMedication: 'ยาประจำ',
  injured: 'มีคนบาดเจ็บ',
  needEnglish: 'ต้องการความช่วยเหลือภาษาอังกฤษ',
  vehicleType: 'ประเภทรถ',
  problem: 'ปัญหา',
  blockingTraffic: 'ขวางทางจราจร',
  passengers: 'จำนวนคน',
  hasCopy: 'มีสำเนาพาสปอร์ต',
  whenLost: 'สูญหายเมื่อไหร่',
  hasOtherId: 'มีเอกสารอื่น',
  situationType: 'ประเภทคำขอ',
  alone: 'อยู่คนเดียวหรือกับผู้อื่น',
  immediateDanger: 'อันตรายทันที',
};

export default function NoEmergencySummary() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [showHelp, setShowHelp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [message, setMessage] = useState({ english: '', thai: '' });
  const savedRef = useRef(false);

  useEffect(() => {
    // Check if user is logged in
    const profile = localStorage.getItem('userProfile');
    setIsLoggedIn(!!profile);

    // Get stored data
    const situation = localStorage.getItem('noEmergencySituation') || 'medical';
    const answers = JSON.parse(localStorage.getItem('noEmergencyAnswers') || '{}');
    const location = JSON.parse(localStorage.getItem('noEmergencyLocation') || '{}');

    // Save to database (once per flow)
    if (!savedRef.current) {
      savedRef.current = true;
      saveEmergency({
        userId: user?.id,
        type: 'no_emergency',
        situation,
        answers,
        location,
      }).catch((err) => console.error(err));
    }

    const facilityType = getFacilityTypeForSituation(situation);
    const profileData = JSON.parse(profile || '{}');

    // Format answers with human-readable labels
    const formatAnswers = (labels: Record<string, string>) =>
      Object.entries(answers)
        .map(([key, value]) => `- ${labels[key] || key}: ${value}`)
        .join('\n');

    const detailsEn = formatAnswers(ANSWER_LABELS_EN);
    const detailsTh = formatAnswers(ANSWER_LABELS_TH);

    // Profile block (name, nationality, insurance, contact, medical notes) – shown when available
    const profileLinesEn: string[] = [];
    const profileLinesTh: string[] = [];
    if (profileData.fullName) {
      profileLinesEn.push(`Name: ${profileData.fullName}`);
      profileLinesTh.push(`ชื่อ: ${profileData.fullName}`);
    }
    if (profileData.nationality) {
      profileLinesEn.push(`Nationality: ${profileData.nationality}`);
      profileLinesTh.push(`สัญชาติ: ${profileData.nationality}`);
    }
    if (profileData.dateOfBirth) {
      profileLinesEn.push(`Date of birth: ${profileData.dateOfBirth}`);
      profileLinesTh.push(`วันเกิด: ${profileData.dateOfBirth}`);
    }
    if (profileData.insuranceNumber) {
      profileLinesEn.push(`Insurance: ${profileData.insuranceNumber}`);
      profileLinesTh.push(`ประกัน: ${profileData.insuranceNumber}`);
    }
    if (profileData.contactName && profileData.contactPhone) {
      profileLinesEn.push(`Emergency contact: ${profileData.contactName} (${profileData.contactPhone})`);
      profileLinesTh.push(`ผู้ติดต่อฉุกเฉิน: ${profileData.contactName} (${profileData.contactPhone})`);
    } else if (profileData.contactPhone) {
      profileLinesEn.push(`Emergency contact: ${profileData.contactPhone}`);
      profileLinesTh.push(`ผู้ติดต่อฉุกเฉิน: ${profileData.contactPhone}`);
    }
    if (profileData.medicalNotes) {
      profileLinesEn.push(`Medical notes: ${profileData.medicalNotes}`);
      profileLinesTh.push(`หมายเหตุทางการแพทย์: ${profileData.medicalNotes}`);
    }
    const profileBlockEn = profileLinesEn.length ? profileLinesEn.join('\n') + '\n\n' : '';
    const profileBlockTh = profileLinesTh.length ? profileLinesTh.join('\n') + '\n\n' : '';

    const locBlockEn = `${location.street || 'Unknown street'}
${location.district || ''}, ${location.province || ''}
GPS: ${location.coordinates || 'Not available'}`;

    const locBlockTh = `${location.street || 'ไม่ทราบถนน'}
${location.district || ''}, ${location.province || ''}
พิกัด GPS: ${location.coordinates || 'ไม่มีข้อมูล'}`;

    // Facility-specific message templates – complete so user only needs to show at the right place
    const templates: Record<string, { en: (p: string, d: string, l: string) => string; th: (p: string, d: string, l: string) => string }> = {
      hospital: {
        en: (p, d, l) => `Hello,

I am a tourist in Thailand. I would like to see a doctor for a non-urgent medical issue.

${p}Current situation:
${d}

My location:
${l}

Please show this to hospital staff. Thank you.`,
        th: (p, d, l) => `สวัสดีครับ/ค่ะ

ฉันเป็นนักท่องเที่ยวในประเทศไทย ต้องการพบแพทย์สำหรับปัญหาสุขภาพที่ไม่ฉุกเฉิน

${p}สถานการณ์ปัจจุบัน:
${d}

ตำแหน่งของฉัน:
${l}

กรุณาแสดงข้อความนี้ให้เจ้าหน้าที่โรงพยาบาล ขอบคุณครับ/ค่ะ`,
      },
      police: {
        en: (p, d, l) => `Hello,

I am a tourist in Thailand. I need assistance (not an emergency).

${p}Details:
${d}

My location:
${l}

Please show this to police. Thank you.`,
        th: (p, d, l) => `สวัสดีครับ/ค่ะ

ฉันเป็นนักท่องเที่ยวในประเทศไทย ต้องการความช่วยเหลือ (ไม่ใช่เหตุฉุกเฉิน)

${p}รายละเอียด:
${d}

ตำแหน่งของฉัน:
${l}

กรุณาแสดงข้อความนี้ให้เจ้าหน้าที่ตำรวจ ขอบคุณครับ/ค่ะ`,
      },
      consulate: {
        en: (p, d, l) => `Hello,

I am a tourist in Thailand. I have lost my passport or travel documents and need consulate assistance.

${p}Details:
${d}

My location:
${l}

Please show this at the consulate. Thank you.`,
        th: (p, d, l) => `สวัสดีครับ/ค่ะ

ฉันเป็นนักท่องเที่ยวในประเทศไทย สูญหายพาสปอร์ตหรือเอกสารเดินทาง และต้องการความช่วยเหลือจากสถานกงสุล

${p}รายละเอียด:
${d}

ตำแหน่งของฉัน:
${l}

กรุณาแสดงข้อความนี้ที่สถานกงสุล ขอบคุณครับ/ค่ะ`,
      },
      towing: {
        en: (p, d, l) => `Hello,

I am a tourist in Thailand. My vehicle has broken down and I need roadside assistance.

${p}Details:
${d}

My location:
${l}

Please share this with the towing service. Thank you.`,
        th: (p, d, l) => `สวัสดีครับ/ค่ะ

ฉันเป็นนักท่องเที่ยวในประเทศไทย รถของฉันเสียและต้องการความช่วยเหลือข้างทาง

${p}รายละเอียด:
${d}

ตำแหน่งของฉัน:
${l}

กรุณาส่งข้อความนี้ให้บริการลากจูง ขอบคุณครับ/ค่ะ`,
      },
    };

    const t = templates[facilityType] || templates.police;
    const englishMsg = t.en(profileBlockEn, detailsEn || '(No additional details)', locBlockEn);
    const thaiMsg = t.th(profileBlockTh, detailsTh || '(ไม่มีรายละเอียดเพิ่มเติม)', locBlockTh);

    setMessage({ english: englishMsg, thai: thaiMsg });
  }, []);

  const handleSendToContact = () => {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (profile.contactPhone) {
      const smsBody = encodeURIComponent(message.english);
      window.location.href = `sms:${profile.contactPhone}?body=${smsBody}`;
      setMessageSent(true);
    }
  };

  const handleDone = () => {
    // Clear session data
    localStorage.removeItem('noEmergencySituation');
    localStorage.removeItem('noEmergencyAnswers');
    localStorage.removeItem('noEmergencyLocation');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
      <Header 
        title={language === 'en' ? 'Generated Message' : 'ข้อความที่สร้าง'} 
      />
      
      <div className="flex-1 px-6 py-6 space-y-5 overflow-y-auto">
        {/* Success Banner */}
        {messageSent && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-800/50 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-300 text-sm">
                {language === 'en' ? 'Message Sent' : 'ส่งข้อความแล้ว'}
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">
                {language === 'en' ? 'Your emergency contact has been notified' : 'ผู้ติดต่อฉุกเฉินของคุณได้รับการแจ้งเตือนแล้ว'}
              </p>
            </div>
          </div>
        )}

        {/* Info - where to show this message */}
        {(() => {
          const situation = localStorage.getItem('noEmergencySituation') || 'medical';
          const facilityType = getFacilityTypeForSituation(situation);
          const showAt = {
            hospital: language === 'en' ? 'Show this at the hospital' : 'แสดงข้อความนี้ที่โรงพยาบาล',
            police: language === 'en' ? 'Show this at the police station' : 'แสดงข้อความนี้ที่สถานีตำรวจ',
            consulate: language === 'en' ? 'Show this at the consulate' : 'แสดงข้อความนี้ที่สถานกงสุล',
            towing: language === 'en' ? 'Share this with the towing service' : 'ส่งข้อความนี้ให้บริการลากจูง',
          }[facilityType];
          return (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 mb-4">
              <p className="text-blue-900 dark:text-blue-300 text-sm font-medium text-center">
                📱 {showAt}
              </p>
              <p className="text-blue-700 dark:text-blue-400 text-xs text-center mt-1">
                {language === 'en' 
                  ? 'Simply show this message – no need to explain further' 
                  : 'เพียงแสดงข้อความนี้ ไม่ต้องอธิบายเพิ่มเติม'}
              </p>
            </div>
          );
        })()}

        {/* English Message */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-gray-600 dark:text-[var(--muted-foreground)]" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[var(--foreground)]">
              {language === 'en' ? 'English Message' : 'ข้อความภาษาอังกฤษ'}
            </h3>
          </div>
          <div className="bg-white dark:bg-[var(--card)] border border-gray-300 dark:border-[var(--border)] rounded-xl p-5 shadow-sm">
            <pre className="text-sm text-gray-900 dark:text-[var(--foreground)] whitespace-pre-wrap font-sans leading-relaxed">
              {message.english}
            </pre>
          </div>
        </div>

        {/* Thai Translation */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-gray-600 dark:text-[var(--muted-foreground)]" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[var(--foreground)]">
              {language === 'en' ? 'Thai Translation' : 'คำแปลภาษาไทย'}
            </h3>
          </div>
          <div className="bg-white dark:bg-[var(--card)] border border-gray-300 dark:border-[var(--border)] rounded-xl p-5 shadow-sm">
            <pre className="text-sm text-gray-900 dark:text-[var(--foreground)] whitespace-pre-wrap font-sans leading-relaxed">
              {message.thai}
            </pre>
          </div>
        </div>

        {/* Edit Details Button */}
        <button
          onClick={() => navigate('/no-emergency-situation')}
          className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all text-gray-900 dark:text-[var(--foreground)] font-medium flex items-center justify-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          {language === 'en' ? 'Edit Details' : 'แก้ไขรายละเอียด'}
        </button>

        {/* Send to Emergency Contact */}
        {isLoggedIn ? (
          <button
            onClick={handleSendToContact}
            disabled={messageSent}
            className={`w-full rounded-2xl p-6 shadow-sm border-2 active:scale-[0.99] transition-all font-semibold ${
              messageSent 
                ? 'bg-gray-200 dark:bg-[var(--secondary)] cursor-not-allowed border-gray-200 dark:border-[var(--border)] text-gray-500 dark:text-[var(--muted-foreground)]' 
                : 'bg-white dark:bg-[var(--card)] border-gray-900 dark:border-[var(--foreground)] hover:border-gray-700 dark:hover:border-[var(--muted-foreground)] text-gray-900 dark:text-[var(--foreground)]'
            }`}
          >
            {messageSent
              ? (language === 'en' ? 'Message Sent' : 'ส่งข้อความแล้ว')
              : (language === 'en' ? 'Send to Emergency Contact' : 'ส่งให้ผู้ติดต่อฉุกเฉิน')}
          </button>
        ) : (
          <div className="bg-gray-100 dark:bg-[var(--secondary)] border border-gray-300 dark:border-[var(--border)] rounded-xl p-5 text-center">
            <p className="text-gray-700 dark:text-[var(--muted-foreground)] font-medium mb-3 text-sm">
              {language === 'en' 
                ? 'Log in to send this message to your emergency contact.' 
                : 'เข้าสู่ระบบเพื่อส่งข้อความนี้ให้ผู้ติดต่อฉุกเฉินของคุณ'}
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-4 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all text-gray-900 dark:text-[var(--foreground)] font-medium"
            >
              {language === 'en' ? 'Login / Create Profile' : 'เข้าสู่ระบบ / สร้างโปรไฟล์'}
            </button>
          </div>
        )}

        {/* Done Button */}
        <button
          onClick={handleDone}
          className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all text-gray-700 dark:text-[var(--muted-foreground)] font-medium"
        >
          {language === 'en' ? 'Done' : 'เสร็จสิ้น'}
        </button>
      </div>
      
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <BottomNav onHelpClick={() => setShowHelp(true)} />
    </div>
  );
}
