import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { HelpModal } from "../components/HelpModal";
import { Shield } from "lucide-react";

const PRIVACY_POLICY_EN = `
Privacy Policy (PDPA Compliance)

1. Data We Collect
• Location data: GPS coordinates for emergency assistance
• Contact information: Phone numbers, names (yours and emergency contacts)
• Health information: Medical notes, allergies, conditions (optional)
• Account data: Email, profile details

2. Why We Collect It
• To provide emergency assistance and share your location with services
• To help emergency responders identify you and contact your emergency contact
• To improve emergency response in Thailand

3. How Long We Store It
• Profile data: Until you delete your account or request deletion
• Location: Used in real-time, not stored permanently
• Logs: Retained as required by law

4. Who Has Access
• Emergency services when you use the app
• Our servers (Supabase, EU) for profile storage
• No sale or sharing with third parties for marketing

5. Sensitive Data (Health)
Health information is optional. If provided, it is stored securely and only shared with emergency services when relevant.

6. Your Rights
• Access, correct, or delete your data
• Withdraw consent
• Contact us for data deletion requests
`;

const PRIVACY_POLICY_TH = `
นโยบายความเป็นส่วนตัว (PDPA)

1. ข้อมูลที่เรารวบรวม
• ข้อมูลตำแหน่ง: พิกัด GPS สำหรับความช่วยเหลือฉุกเฉิน
• ข้อมูลติดต่อ: เบอร์โทรศัพท์ ชื่อ (ของคุณและผู้ติดต่อฉุกเฉิน)
• ข้อมูลสุขภาพ: หมายเหตุทางการแพทย์ อาการแพ้ (ไม่บังคับ)
• ข้อมูลบัญชี: อีเมล รายละเอียดโปรไฟล์

2. เหตุผลในการรวบรวม
• เพื่อให้ความช่วยเหลือฉุกเฉินและแชร์ตำแหน่งกับหน่วยบริการ
• เพื่อช่วยให้หน่วยกู้ภัยระบุตัวคุณและติดต่อผู้ติดต่อฉุกเฉิน
• เพื่อปรับปรุงการตอบสนองฉุกเฉินในประเทศไทย

3. ระยะเวลาเก็บข้อมูล
• ข้อมูลโปรไฟล์: จนกว่าคุณจะลบบัญชีหรือขอให้ลบ
• ตำแหน่ง: ใช้แบบเรียลไทม์ ไม่เก็บถาวร
• บันทึก: เก็บตามที่กฎหมายกำหนด

4. ผู้ที่มีสิทธิ์เข้าถึง
• บริการฉุกเฉินเมื่อคุณใช้แอป
• เซิร์ฟเวอร์ของเรา (Supabase, EU) สำหรับเก็บโปรไฟล์
• ไม่ขายหรือแชร์กับบุคคลที่สามเพื่อการตลาด

5. ข้อมูลอ่อนไหว (สุขภาพ)
ข้อมูลสุขภาพเป็นทางเลือก หากให้มา จะเก็บอย่างปลอดภัยและแชร์กับบริการฉุกเฉินเฉพาะเมื่อเกี่ยวข้อง

6. สิทธิของคุณ
• เข้าถึง แก้ไข หรือลบข้อมูลของคุณ
• ถอนความยินยอม
• ติดต่อเราเพื่อขอลบข้อมูล
`;

export default function PrivacyPolicy() {
  const { language } = useLanguage();
  const [showHelp, setShowHelp] = React.useState(false);
  const text = language === "en" ? PRIVACY_POLICY_EN : PRIVACY_POLICY_TH;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
      <Header
        title={language === "en" ? "Privacy Policy" : "นโยบายความเป็นส่วนตัว"}
        showBack={true}
      />
      <div className="flex-1 px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-[var(--foreground)]">
              {language === "en" ? "Privacy Policy (PDPA)" : "นโยบายความเป็นส่วนตัว (PDPA)"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)]">
              {language === "en" ? "Thailand Personal Data Protection Act" : "พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล"}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-[var(--card)] border border-gray-200 dark:border-[var(--border)] rounded-xl p-5 shadow-sm">
          <p className="text-gray-700 dark:text-[var(--muted-foreground)] text-sm leading-relaxed whitespace-pre-line">{text}</p>
        </div>
      </div>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <BottomNav onHelpClick={() => setShowHelp(true)} />
    </div>
  );
}
