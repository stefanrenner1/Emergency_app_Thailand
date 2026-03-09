import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { HelpModal } from "../components/HelpModal";
import { AlertTriangle } from "lucide-react";

const DISCLAIMER_EN = `
Important Notice – Liability Disclaimer

This app does NOT replace professional medical or emergency services.

In a life-threatening situation, always call local emergency numbers immediately:
• Police: 191
• Ambulance / Medical: 1669
• Tourist Police (English support): 1155

The information provided in this app is for general guidance only. First-aid instructions and emergency guidance may be interpreted incorrectly. We are not liable for any harm resulting from the use of this app.

Always seek professional medical help in emergencies.
`;

const DISCLAIMER_TH = `
ประกาศสำคัญ – ข้อจำกัดความรับผิดชอบ

แอปนี้ไม่สามารถแทนที่บริการทางการแพทย์หรือฉุกเฉินมืออาชีพได้

ในสถานการณ์ที่คุกคามชีวิต โปรดโทรหมายเลขฉุกเฉินทันที:
• ตำรวจ: 191
• รถพยาบาล / การแพทย์: 1669
• ตำรวจท่องเที่ยว (ภาษาอังกฤษ): 1155

ข้อมูลในแอปนี้เป็นเพียงคำแนะนำทั่วไป คำแนะนำการปฐมพยาบาลอาจถูกตีความผิด เราไม่รับผิดชอบต่อความเสียหายจากการใช้แอปนี้

โปรดขอความช่วยเหลือทางการแพทย์จากผู้เชี่ยวชาญในกรณีฉุกเฉินเสมอ
`;

export default function Disclaimer() {
  const { language } = useLanguage();
  const [showHelp, setShowHelp] = React.useState(false);
  const text = language === "en" ? DISCLAIMER_EN : DISCLAIMER_TH;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
      <Header
        title={language === "en" ? "Disclaimer" : "ข้อจำกัดความรับผิดชอบ"}
        showBack={true}
      />
      <div className="flex-1 px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-amber-100 p-3 rounded-xl">
            <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-[var(--foreground)]">
              {language === "en" ? "Liability Disclaimer" : "ข้อจำกัดความรับผิดชอบ"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)]">
              {language === "en" ? "Please read carefully" : "กรุณาอ่านอย่างละเอียด"}
            </p>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-5 shadow-sm">
          <p className="text-amber-900 dark:text-amber-200 text-sm leading-relaxed whitespace-pre-line">{text}</p>
        </div>
      </div>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <BottomNav onHelpClick={() => setShowHelp(true)} />
    </div>
  );
}
