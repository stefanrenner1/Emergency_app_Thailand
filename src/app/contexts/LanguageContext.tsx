import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'th';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Landing
    appTitle: 'Emergency Assistant Thailand',
    appSubtitle: 'Fast help. Clear communication.',
    medicalEmergencyBtn: 'Medical Emergency',
    accidentBtn: 'Accident',
    vehicleBreakdownBtn: 'Vehicle Breakdown',
    notSureBtn: 'I\'m Not Sure',
    continueAsGuest: 'Continue as Guest',
    loginCreateProfile: 'Login / Create Profile',
    emergencyWarning: 'For life-threatening emergencies, call 1669 immediately',
    
    // Subcategory
    selectOption: 'Select Emergency Type',
    unconsciousPerson: 'Unconscious person',
    breathingProblems: 'Breathing problems',
    severeBleeding: 'Severe bleeding',
    strongPain: 'Strong pain',
    otherMedical: 'Other medical issue',
    carAccident: 'Car Accident',
    motorcycleAccident: 'Motorcycle Accident',
    pedestrianAccident: 'Pedestrian Accident',
    bicycleAccident: 'Bicycle Accident',
    otherAccident: 'Other Accident',
    carBreakdown: 'Car Breakdown',
    motorcycleBreakdown: 'Motorcycle Breakdown',
    flatTire: 'Flat Tire',
    outOfFuel: 'Out of Fuel',
    engineProblem: 'Engine Problem',
    
    // Questions
    quickQuestions: 'Quick Questions',
    stepIndicator: 'Step {{current}} of {{total}}',
    isAnyoneInjured: 'Is anyone injured?',
    isPersonConscious: 'Is the person conscious?',
    isImmediateDanger: 'Is there immediate danger?',
    yes: 'Yes',
    no: 'No',
    
    // Location
    locationTitle: 'Your Location',
    autoDetectedLocation: 'Automatically detected location',
    street: 'Street',
    district: 'District',
    province: 'Province',
    coordinates: 'GPS Coordinates',
    copyLocation: 'Copy Location',
    locationWillBeSent: 'This location will be sent to emergency services.',
    
    // AI Decision & Message
    emergencyIdentified: 'Emergency Identified',
    basedOnAnswers: 'Based on your answers, we will contact:',
    englishMessage: 'English Message',
    thaiTranslation: 'Thai Translation',
    confirmAndContact: 'Confirm and Contact Service',
    editInformation: 'Edit Information',
    
    // Contact Confirmation
    contactingService: 'Contacting Emergency Service',
    callNow: 'Call Now',
    sendMessage: 'Send Message',
    notifyEmergencyContact: 'Notify Emergency Contact',
    
    // Emergency Services
    ambulance1669: 'Ambulance (1669)',
    police191: 'Police (191)',
    touristPolice1155: 'Tourist Police (1155)',
    
    // Profile
    profileTitle: 'Create Profile',
    profileExplanation: 'Creating a profile allows emergency services and your emergency contact to identify you faster.',
    fullName: 'Full Name',
    insuranceNumber: 'Insurance Number',
    nationality: 'Nationality',
    dateOfBirth: 'Date of Birth',
    emergencyContact: 'Emergency Contact',
    contactName: 'Emergency Contact Name',
    contactPhone: 'Emergency Contact Phone Number',
    medicalNotes: 'Medical Notes (allergies, conditions)',
    medicalNotesPlaceholder: 'Allergies, medical conditions, medications, blood type...',
    saveProfile: 'Save Profile',
    continueWithoutProfile: 'Continue without Profile',
    
    // Auth / Login / Register
    loginTitle: 'Login',
    login: 'Login',
    loggingIn: 'Logging in...',
    registerTitle: 'Register',
    register: 'Register',
    registering: 'Registering...',
    email: 'Email',
    password: 'Password',
    passwordConfirm: 'Confirm Password',
    passwordMinLength: 'At least 6 characters',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    loginErrorFillAll: 'Please enter email and password.',
    loginErrorGeneric: 'Login failed. Please check your credentials.',
    registerErrorFillAll: 'Please fill in all fields.',
    registerErrorPasswordMismatch: 'Passwords do not match.',
    registerErrorPasswordShort: 'Password must be at least 6 characters.',
    registerErrorGeneric: 'Registration failed. Please try again.',
    registerSuccess: 'Registration successful!',
    registerRedirect: 'Redirecting to profile...',
    
    // Common
    back: 'Back',
    next: 'Next',
    cancel: 'Cancel',
    returnHome: 'Return to Home',
  },
  th: {
    // Landing
    appTitle: 'ผู้ช่วยฉุกเฉิน ประเทศไทย',
    appSubtitle: 'ช่วยเหลือรวดเร็ว สื่อสารชัดเจน',
    medicalEmergencyBtn: 'ฉุกเฉินทางการแพทย์',
    accidentBtn: 'อุบัติเหตุ',
    vehicleBreakdownBtn: 'รถเสีย',
    notSureBtn: 'ไม่แน่ใจ',
    continueAsGuest: 'ดำเนินการต่อแบบผู้เยี่ยมชม',
    loginCreateProfile: 'เข้าสู่ระบบ / สร้างโปรไฟล์',
    emergencyWarning: 'สำหรับเหตุฉุกเฉินที่คุกคามชีวิต โทร 1669 ทันที',
    
    // Subcategory
    selectOption: 'เลือกประเภทเหตุฉุกเฉิน',
    unconsciousPerson: 'คนไม่รู้สึกตัว',
    breathingProblems: 'หายใจลำบาก',
    severeBleeding: 'เลือดออกมาก',
    strongPain: 'ปวดมาก',
    otherMedical: 'ปัญหาทางการแพทย์อื่นๆ',
    carAccident: 'อุบัติเหตุรถยนต์',
    motorcycleAccident: 'อุบัติเหตุมอเตอร์ไซค์',
    pedestrianAccident: 'อุบัติเหตุคนเดินเท้า',
    bicycleAccident: 'อุบัติเหตุจักรยาน',
    otherAccident: 'อุบัติเหตุอื่นๆ',
    carBreakdown: 'รถยนต์เสีย',
    motorcycleBreakdown: 'มอเตอร์ไซค์เสีย',
    flatTire: 'ยางแบน',
    outOfFuel: 'น้ำมันหมด',
    engineProblem: 'เครื่องยนต์มีปัญหา',
    
    // Questions
    quickQuestions: 'คำถามด่วน',
    stepIndicator: 'ขั้นตอนที่ {{current}} จาก {{total}}',
    isAnyoneInjured: 'มีใครบาดเจ็บหรือไม่?',
    isPersonConscious: 'คนนั้นรู้สึกตัวอยู่หรือไม่?',
    isImmediateDanger: 'มีอันตรายทันทีหรือไม่?',
    yes: 'ใช่',
    no: 'ไม่ใช่',
    
    // Location
    locationTitle: 'ตำแหน่งของคุณ',
    autoDetectedLocation: 'ตำแหน่งที่ตรวจพบอัตโนมัติ',
    street: 'ถนน',
    district: 'เขต/อำเภอ',
    province: 'จังหวัด',
    coordinates: 'พิกัด GPS',
    copyLocation: 'คัดลอกตำแหน่ง',
    locationWillBeSent: 'ตำแหน่งนี้จะถูกส่งไปยังบริการฉุกเฉิน',
    
    // AI Decision & Message
    emergencyIdentified: 'ระบุเหตุฉุกเฉินแล้ว',
    basedOnAnswers: 'จากคำตอบของคุณ เราจะติดต่อ:',
    englishMessage: 'ข้อความภาษาอังกฤษ',
    thaiTranslation: 'ข้อความภาษาไทย',
    confirmAndContact: 'ยืนยันและติดต่อบริการ',
    editInformation: 'แก้ไขข้อมูล',
    
    // Contact Confirmation
    contactingService: 'กำลังติดต่อบริการฉุกเฉิน',
    callNow: 'โทรเลย',
    sendMessage: 'ส่งข้อความ',
    notifyEmergencyContact: 'แจ้งผู้ติดต่อฉุกเฉิน',
    
    // Emergency Services
    ambulance1669: 'รถพยาบาล (1669)',
    police191: 'ตำรวจ (191)',
    touristPolice1155: 'ตำรวจท่องเที่ยว (1155)',
    
    // Profile
    profileTitle: 'สร้างโปรไฟล์',
    profileExplanation: 'การสร้างโปรไฟล์ช่วยให้บริการฉุกเฉินและผู้ติดต่อฉุกเฉินของคุณระบุตัวคุณได้เร็วขึ้น',
    fullName: 'ชื่อ-นามสกุล',
    insuranceNumber: 'หมายเลขประกัน',
    nationality: 'สัญชาติ',
    dateOfBirth: 'วันเกิด',
    emergencyContact: 'ผู้ติดต่อฉุกเฉิน',
    contactName: 'ชื่อผู้ติดต่อฉุกเฉิน',
    contactPhone: 'หมายเลขโทรศัพท์ผู้ติดต่อฉุกเฉิน',
    medicalNotes: 'บันทึกทางการแพทย์ (อาการแพ้, โรคประจำตัว)',
    medicalNotesPlaceholder: 'อาการแพ้, โรคประจำตัว, ยาที่ใช้, กรุ๊ปเลือด...',
    saveProfile: 'บันทึกโปรไฟล์',
    continueWithoutProfile: 'ดำเนินการต่อโดยไม่มีโปรไฟล์',
    
    // Auth / Login / Register
    loginTitle: 'เข้าสู่ระบบ',
    login: 'เข้าสู่ระบบ',
    loggingIn: 'กำลังเข้าสู่ระบบ...',
    registerTitle: 'สมัครสมาชิก',
    register: 'สมัครสมาชิก',
    registering: 'กำลังสมัครสมาชิก...',
    email: 'อีเมล',
    password: 'รหัสผ่าน',
    passwordConfirm: 'ยืนยันรหัสผ่าน',
    passwordMinLength: 'อย่างน้อย 6 ตัวอักษร',
    noAccount: 'ยังไม่มีบัญชี?',
    hasAccount: 'มีบัญชีอยู่แล้ว?',
    loginErrorFillAll: 'กรุณากรอกอีเมลและรหัสผ่าน',
    loginErrorGeneric: 'เข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูล',
    registerErrorFillAll: 'กรุณากรอกข้อมูลให้ครบ',
    registerErrorPasswordMismatch: 'รหัสผ่านไม่ตรงกัน',
    registerErrorPasswordShort: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
    registerErrorGeneric: 'การสมัครสมาชิกล้มเหลว กรุณาลองอีกครั้ง',
    registerSuccess: 'สมัครสมาชิกสำเร็จ!',
    registerRedirect: 'กำลังไปยังโปรไฟล์...',
    
    // Common
    back: 'ย้อนกลับ',
    next: 'ถัดไป',
    cancel: 'ยกเลิก',
    returnHome: 'กลับหน้าหลัก',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}