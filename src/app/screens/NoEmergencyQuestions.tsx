import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { HelpModal } from '../components/HelpModal';

export default function NoEmergencyQuestions() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [showHelp, setShowHelp] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const situation = localStorage.getItem('noEmergencySituation') || 'medical';

  // Different questions based on situation
  const questionSets: Record<string, Array<{ 
    key: string; 
    questionEn: string; 
    questionTh: string;
    options: Array<{ valueEn: string; valueTh: string }>;
  }>> = {
    medical: [
      {
        key: 'symptoms',
        questionEn: 'What are your main symptoms?',
        questionTh: 'อาการหลักของคุณคืออะไร?',
        options: [
          { valueEn: 'Fever', valueTh: 'ไข้' },
          { valueEn: 'Pain / injury', valueTh: 'ปวด / บาดเจ็บ' },
          { valueEn: 'Stomachache', valueTh: 'ปวดท้อง' },
          { valueEn: 'Rash / skin issue', valueTh: 'ผื่น / ปัญหาผิวหนัง' },
          { valueEn: 'Respiratory / cough', valueTh: 'ระบบหายใจ / ไอ' },
          { valueEn: 'Diarrhea / vomiting', valueTh: 'ท้องเสีย / อาเจียน' },
          { valueEn: 'Other', valueTh: 'อื่นๆ' },
        ],
      },
      {
        key: 'symptomDuration',
        questionEn: 'How long have you had these symptoms?',
        questionTh: 'มีอาการมานานเท่าไหร่?',
        options: [
          { valueEn: 'Today', valueTh: 'วันนี้' },
          { valueEn: '1–2 days', valueTh: '1–2 วัน' },
          { valueEn: '3–7 days', valueTh: '3–7 วัน' },
          { valueEn: 'More than a week', valueTh: 'มากกว่า 1 สัปดาห์' },
        ],
      },
      {
        key: 'allergies',
        questionEn: 'Do you have any known allergies?',
        questionTh: 'คุณมีอาการแพ้ที่ทราบหรือไม่?',
        options: [
          { valueEn: 'No', valueTh: 'ไม่มี' },
          { valueEn: 'Yes – medication', valueTh: 'ใช่ – ยา' },
          { valueEn: 'Yes – food', valueTh: 'ใช่ – อาหาร' },
          { valueEn: 'Yes – other', valueTh: 'ใช่ – อื่นๆ' },
        ],
      },
      {
        key: 'regularMedication',
        questionEn: 'Are you taking any regular medications?',
        questionTh: 'คุณกำลังรับประทานยาประจำหรือไม่?',
        options: [
          { valueEn: 'No', valueTh: 'ไม่มี' },
          { valueEn: 'Yes', valueTh: 'ใช่' },
        ],
      },
      {
        key: 'injured',
        questionEn: 'Is anyone with you injured?',
        questionTh: 'มีใครบาดเจ็บหรือไม่?',
        options: [
          { valueEn: 'Yes', valueTh: 'ใช่' },
          { valueEn: 'No', valueTh: 'ไม่' },
        ],
      },
      {
        key: 'needEnglish',
        questionEn: 'Do you need help in English?',
        questionTh: 'คุณต้องการความช่วยเหลือเป็นภาษาอังกฤษหรือไม่?',
        options: [
          { valueEn: 'Yes', valueTh: 'ใช่' },
          { valueEn: 'No', valueTh: 'ไม่' },
        ],
      },
    ],
    breakdown: [
      {
        key: 'vehicleType',
        questionEn: 'What type of vehicle?',
        questionTh: 'ประเภทรถยนต์?',
        options: [
          { valueEn: 'Car', valueTh: 'รถยนต์' },
          { valueEn: 'Motorcycle', valueTh: 'รถจักรยานยนต์' },
          { valueEn: 'Van / truck', valueTh: 'รถตู้ / รถบรรทุก' },
          { valueEn: 'Other', valueTh: 'อื่นๆ' },
        ],
      },
      {
        key: 'problem',
        questionEn: 'What happened?',
        questionTh: 'เกิดอะไรขึ้น?',
        options: [
          { valueEn: 'Won\'t start', valueTh: 'สตาร์ทไม่ติด' },
          { valueEn: 'Flat tire', valueTh: 'ยางแบน' },
          { valueEn: 'Accident / collision', valueTh: 'อุบัติเหตุ / ชน' },
          { valueEn: 'Overheating', valueTh: 'เครื่องร้อน' },
          { valueEn: 'Out of fuel', valueTh: 'น้ำมันหมด' },
          { valueEn: 'Other', valueTh: 'อื่นๆ' },
        ],
      },
      {
        key: 'blockingTraffic',
        questionEn: 'Is the vehicle blocking traffic?',
        questionTh: 'รถยนต์ขวางทางจราจรหรือไม่?',
        options: [
          { valueEn: 'Yes', valueTh: 'ใช่' },
          { valueEn: 'No', valueTh: 'ไม่' },
        ],
      },
      {
        key: 'passengers',
        questionEn: 'How many people are with you?',
        questionTh: 'มีกี่คนอยู่กับคุณ?',
        options: [
          { valueEn: '1 (alone)', valueTh: '1 คน (คนเดียว)' },
          { valueEn: '2–3', valueTh: '2–3 คน' },
          { valueEn: '4 or more', valueTh: '4 คนขึ้นไป' },
        ],
      },
      {
        key: 'needEnglish',
        questionEn: 'Do you need help in English?',
        questionTh: 'คุณต้องการความช่วยเหลือเป็นภาษาอังกฤษหรือไม่?',
        options: [
          { valueEn: 'Yes', valueTh: 'ใช่' },
          { valueEn: 'No', valueTh: 'ไม่' },
        ],
      },
    ],
    assistance: [
      {
        key: 'situationType',
        questionEn: 'What do you need?',
        questionTh: 'คุณต้องการอะไร?',
        options: [
          { valueEn: 'Lost / need directions', valueTh: 'หลงทาง / ต้องการคำแนะนำเส้นทาง' },
          { valueEn: 'Need general help', valueTh: 'ต้องการความช่วยเหลือทั่วไป' },
          { valueEn: 'Report something', valueTh: 'ต้องการแจ้งเรื่อง' },
          { valueEn: 'Lost item / theft', valueTh: 'ของหาย / ถูกขโมย' },
          { valueEn: 'Other', valueTh: 'อื่นๆ' },
        ],
      },
      {
        key: 'alone',
        questionEn: 'Are you alone?',
        questionTh: 'คุณอยู่คนเดียวหรือไม่?',
        options: [
          { valueEn: 'Yes', valueTh: 'ใช่' },
          { valueEn: 'No – with family/friends', valueTh: 'ไม่ – กับครอบครัว/เพื่อน' },
        ],
      },
      {
        key: 'immediateDanger',
        questionEn: 'Is there immediate danger?',
        questionTh: 'มีอันตรายทันทีหรือไม่?',
        options: [
          { valueEn: 'Yes', valueTh: 'ใช่' },
          { valueEn: 'No', valueTh: 'ไม่' },
        ],
      },
      {
        key: 'needEnglish',
        questionEn: 'Do you need help in English?',
        questionTh: 'คุณต้องการความช่วยเหลือเป็นภาษาอังกฤษหรือไม่?',
        options: [
          { valueEn: 'Yes', valueTh: 'ใช่' },
          { valueEn: 'No', valueTh: 'ไม่' },
        ],
      },
    ],
    lost_passport: [
      {
        key: 'hasCopy',
        questionEn: 'Do you have a copy of your passport?',
        questionTh: 'คุณมีสำเนาพาสปอร์ตหรือไม่?',
        options: [
          { valueEn: 'Yes', valueTh: 'ใช่' },
          { valueEn: 'No', valueTh: 'ไม่' },
        ],
      },
      {
        key: 'whenLost',
        questionEn: 'When did you lose it?',
        questionTh: 'สูญหายเมื่อไหร่?',
        options: [
          { valueEn: 'Today', valueTh: 'วันนี้' },
          { valueEn: 'Yesterday', valueTh: 'เมื่อวาน' },
          { valueEn: 'A few days ago', valueTh: 'หลายวันก่อน' },
          { valueEn: 'Not sure', valueTh: 'ไม่แน่ใจ' },
        ],
      },
      {
        key: 'hasOtherId',
        questionEn: 'Do you have other ID (driver\'s license, etc.)?',
        questionTh: 'คุณมีเอกสารอื่น (ใบขับขี่ ฯลฯ) หรือไม่?',
        options: [
          { valueEn: 'Yes', valueTh: 'ใช่' },
          { valueEn: 'No', valueTh: 'ไม่' },
        ],
      },
      {
        key: 'needEnglish',
        questionEn: 'Do you need help in English?',
        questionTh: 'คุณต้องการความช่วยเหลือเป็นภาษาอังกฤษหรือไม่?',
        options: [
          { valueEn: 'Yes', valueTh: 'ใช่' },
          { valueEn: 'No', valueTh: 'ไม่' },
        ],
      },
    ],
    other: [
      {
        key: 'situationType',
        questionEn: 'What do you need?',
        questionTh: 'คุณต้องการอะไร?',
        options: [
          { valueEn: 'General assistance', valueTh: 'ความช่วยเหลือทั่วไป' },
          { valueEn: 'Report something', valueTh: 'ต้องการแจ้งเรื่อง' },
          { valueEn: 'Lost item / theft', valueTh: 'ของหาย / ถูกขโมย' },
          { valueEn: 'Other', valueTh: 'อื่นๆ' },
        ],
      },
      {
        key: 'alone',
        questionEn: 'Are you alone?',
        questionTh: 'คุณอยู่คนเดียวหรือไม่?',
        options: [
          { valueEn: 'Yes', valueTh: 'ใช่' },
          { valueEn: 'No – with family/friends', valueTh: 'ไม่ – กับครอบครัว/เพื่อน' },
        ],
      },
      {
        key: 'immediateDanger',
        questionEn: 'Is there immediate danger?',
        questionTh: 'มีอันตรายทันทีหรือไม่?',
        options: [
          { valueEn: 'Yes', valueTh: 'ใช่' },
          { valueEn: 'No', valueTh: 'ไม่' },
        ],
      },
      {
        key: 'needEnglish',
        questionEn: 'Do you need help in English?',
        questionTh: 'คุณต้องการความช่วยเหลือเป็นภาษาอังกฤษหรือไม่?',
        options: [
          { valueEn: 'Yes', valueTh: 'ใช่' },
          { valueEn: 'No', valueTh: 'ไม่' },
        ],
      },
    ],
  };

  const questions = questionSets[situation] || questionSets.other;
  const currentQ = questions[currentQuestion];

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQ.key]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Save answers and move to location screen
      localStorage.setItem('noEmergencyAnswers', JSON.stringify(newAnswers));
      navigate('/no-emergency-location');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
      <Header 
        title={language === 'en' ? 'Quick Questions' : 'คำถามด่วน'} 
      />
      
      <div className="flex-1 flex flex-col px-6 py-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-[var(--muted-foreground)]">
              {language === 'en' 
                ? `Question ${currentQuestion + 1} of ${questions.length}` 
                : `คำถามที่ ${currentQuestion + 1} จาก ${questions.length}`}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-[var(--secondary)] rounded-full h-1.5">
            <div
              className="bg-gray-900 dark:bg-[var(--foreground)] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--foreground)] text-center mb-10 leading-relaxed">
            {language === 'en' ? currentQ.questionEn : currentQ.questionTh}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.valueEn)}
                className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all text-gray-900 dark:text-[var(--foreground)] font-semibold text-base"
              >
                {language === 'en' ? option.valueEn : option.valueTh}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <BottomNav onHelpClick={() => setShowHelp(true)} />
    </div>
  );
}
