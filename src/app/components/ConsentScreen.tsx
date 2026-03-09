import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";

const PRIVACY_POLICY_EN = `
## Privacy Policy (PDPA Compliance)

### 1. Data We Collect
• **Location data**: GPS coordinates for emergency assistance
• **Contact information**: Phone numbers, names (yours and emergency contacts)
• **Health information**: Medical notes, allergies, conditions (optional)
• **Account data**: Email, profile details

### 2. Why We Collect It
• To provide emergency assistance and share your location with services
• To help emergency responders identify you and contact your emergency contact
• To improve emergency response in Thailand

### 3. How Long We Store It
• Profile data: Until you delete your account or request deletion
• Location: Used in real-time, not stored permanently
• Logs: Retained as required by law

### 4. Who Has Access
• Emergency services when you use the app
• Our servers (Supabase, EU) for profile storage
• No sale or sharing with third parties for marketing

### 5. Sensitive Data (Health)
Health information is optional. If provided, it is stored securely and only shared with emergency services when relevant.

### 6. Your Rights
• Access, correct, or delete your data
• Withdraw consent
• Contact us for data deletion requests
`;

const PRIVACY_POLICY_TH = `
## นโยบายความเป็นส่วนตัว (PDPA)

### 1. ข้อมูลที่เรารวบรวม
• **ข้อมูลตำแหน่ง**: พิกัด GPS สำหรับความช่วยเหลือฉุกเฉิน
• **ข้อมูลติดต่อ**: เบอร์โทรศัพท์ ชื่อ (ของคุณและผู้ติดต่อฉุกเฉิน)
• **ข้อมูลสุขภาพ**: หมายเหตุทางการแพทย์ อาการแพ้ (ไม่บังคับ)
• **ข้อมูลบัญชี**: อีเมล รายละเอียดโปรไฟล์

### 2. เหตุผลในการรวบรวม
• เพื่อให้ความช่วยเหลือฉุกเฉินและแชร์ตำแหน่งกับหน่วยบริการ
• เพื่อช่วยให้หน่วยกู้ภัยระบุตัวคุณและติดต่อผู้ติดต่อฉุกเฉิน
• เพื่อปรับปรุงการตอบสนองฉุกเฉินในประเทศไทย

### 3. ระยะเวลาเก็บข้อมูล
• ข้อมูลโปรไฟล์: จนกว่าคุณจะลบบัญชีหรือขอให้ลบ
• ตำแหน่ง: ใช้แบบเรียลไทม์ ไม่เก็บถาวร
• บันทึก: เก็บตามที่กฎหมายกำหนด

### 4. ผู้ที่มีสิทธิ์เข้าถึง
• บริการฉุกเฉินเมื่อคุณใช้แอป
• เซิร์ฟเวอร์ของเรา (Supabase, EU) สำหรับเก็บโปรไฟล์
• ไม่ขายหรือแชร์กับบุคคลที่สามเพื่อการตลาด

### 5. ข้อมูลอ่อนไหว (สุขภาพ)
ข้อมูลสุขภาพเป็นทางเลือก หากให้มา จะเก็บอย่างปลอดภัยและแชร์กับบริการฉุกเฉินเฉพาะเมื่อเกี่ยวข้อง

### 6. สิทธิของคุณ
• เข้าถึง แก้ไข หรือลบข้อมูลของคุณ
• ถอนความยินยอม
• ติดต่อเราเพื่อขอลบข้อมูล
`;

interface ConsentScreenProps {
  onAccept: () => void;
}

export function ConsentScreen({ onAccept }: ConsentScreenProps) {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const text = language === "en" ? PRIVACY_POLICY_EN : PRIVACY_POLICY_TH;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col p-6">
      <div className="flex-1 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-[var(--foreground)]">
              {language === "en" ? "Privacy Policy & Consent" : "นโยบายความเป็นส่วนตัวและความยินยอม"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)]">
              {language === "en" ? "Thailand PDPA Compliance" : "การปฏิบัติตาม PDPA ประเทศไทย"}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[var(--card)] border border-gray-200 dark:border-[var(--border)] rounded-xl p-4 mb-6">
          <p className="text-gray-700 dark:text-[var(--muted-foreground)] text-sm leading-relaxed whitespace-pre-line">
            {language === "en"
              ? "We need your consent to collect and process your data for emergency assistance. Please read our privacy policy below."
              : "เราต้องการความยินยอมของคุณในการรวบรวมและประมวลผลข้อมูลเพื่อความช่วยเหลือฉุกเฉิน กรุณาอ่านนโยบายความเป็นส่วนตัวด้านล่าง"}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-[var(--border)] rounded-xl overflow-hidden mb-6">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[var(--secondary)] hover:bg-gray-100 dark:hover:bg-[var(--accent)] text-left"
          >
            <span className="font-medium text-gray-900 dark:text-[var(--foreground)]">
              {language === "en" ? "Full Privacy Policy" : "นโยบายความเป็นส่วนตัวฉบับเต็ม"}
            </span>
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expanded && (
            <div className="p-4 bg-white dark:bg-[var(--card)] max-h-64 overflow-y-auto text-sm text-gray-700 dark:text-[var(--muted-foreground)] whitespace-pre-line">
              {text}
            </div>
          )}
        </div>

        <button
          onClick={onAccept}
          className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-900 dark:border-[var(--foreground)] hover:border-gray-700 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all text-gray-900 dark:text-[var(--foreground)] font-semibold"
        >
          {language === "en" ? "I Accept – Continue" : "ฉันยอมรับ – ดำเนินการต่อ"}
        </button>
      </div>
    </div>
  );
}
